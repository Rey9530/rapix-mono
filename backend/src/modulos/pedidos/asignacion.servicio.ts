import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventosDominio } from '../../eventos/eventos-dominio.js';
import { PedidoEstadoCambiadoEvento } from '../../eventos/pedido-estado-cambiado.evento.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { AsignarPedidoDto } from './dto/asignar-pedido.dto.js';
import { PedidoMaquinaEstados } from './maquina-estados/pedido-maquina-estados.js';

const CAPACIDAD_MAX = 15;
const ESTADOS_ACTIVOS: Array<
  'ASIGNADO' | 'RECOGIDO' | 'EN_TRANSITO' | 'EN_PUNTO_INTERCAMBIO' | 'EN_REPARTO'
> = ['ASIGNADO', 'RECOGIDO', 'EN_TRANSITO', 'EN_PUNTO_INTERCAMBIO', 'EN_REPARTO'];

@Injectable()
export class AsignacionServicio {
  constructor(
    private readonly prisma: PrismaServicio,
    private readonly eventos: EventEmitter2,
  ) {}

  /**
   * Selecciona el mejor repartidor primario de la zona origen:
   *   - `disponible = true`
   *   - carga activa < 15 pedidos
   *   - menor carga primero, desempate por calificación descendente
   */
  async asignar(pedidoId: string, actorId: string) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });
    if (pedido.estado !== 'PENDIENTE_ASIGNACION') {
      return { asignado: false, motivo: 'Pedido no está en PENDIENTE_ASIGNACION' };
    }
    if (!pedido.zonaOrigenId) {
      return { asignado: false, motivo: 'Pedido sin zona de origen' };
    }

    // Candidatos: repartidores primarios de la zona origen, disponibles,
    // con carga activa < 15. Orden: menor carga, mejor calificación.
    const candidatos = await this.prisma.$queryRawUnsafe<
      Array<{ id: string; calificacion: number; carga: bigint }>
    >(
      `SELECT pr.id, pr.calificacion,
              (SELECT COUNT(*)
                 FROM pedidos p
                 WHERE (p."repartidorRecogidaId" = pr.id OR p."repartidorEntregaId" = pr.id)
                   AND p.estado IN ('ASIGNADO','RECOGIDO','EN_TRANSITO','EN_PUNTO_INTERCAMBIO','EN_REPARTO')
              ) AS carga
       FROM perfiles_repartidor pr
       INNER JOIN zonas_repartidor zr ON zr."repartidorId" = pr.id
       WHERE zr."zonaId" = $1
         AND pr.disponible = true
       ORDER BY carga ASC, pr.calificacion DESC
       LIMIT 10`,
      pedido.zonaOrigenId,
    );

    const elegido = candidatos.find((c) => Number(c.carga) < CAPACIDAD_MAX);
    if (!elegido) {
      return { asignado: false, motivo: 'Sin repartidores con capacidad' };
    }

    PedidoMaquinaEstados.validarTransicion(pedido.estado, 'ASIGNADO');

    const actualizado = await this.prisma.$transaction(async (tx) => {
      const p = await tx.pedido.update({
        where: { id: pedidoId },
        data: { estado: 'ASIGNADO', repartidorRecogidaId: elegido.id },
      });
      await tx.eventoPedido.create({
        data: {
          pedidoId,
          estado: 'ASIGNADO',
          actorId,
          notas: `Asignado automáticamente (carga=${elegido.carga})`,
        },
      });
      return p;
    });

    this.eventos.emit(
      EventosDominio.PedidoEstadoCambiado,
      new PedidoEstadoCambiadoEvento(
        pedidoId,
        'PENDIENTE_ASIGNACION',
        'ASIGNADO',
        actorId,
        new Date(),
      ),
    );

    return {
      asignado: true,
      repartidorId: elegido.id,
      carga: Number(elegido.carga),
      pedido: actualizado,
    };
  }

  async asignarManual(usuario: Usuario, pedidoId: string, dto: AsignarPedidoDto) {
    if (!dto.repartidorRecogidaId && !dto.repartidorEntregaId) {
      throw new BadRequestException('Debe indicar repartidorRecogidaId o repartidorEntregaId');
    }
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) throw new NotFoundException({ codigo: 'PEDIDO_NO_ENCONTRADO' });

    const ids = [
      ...new Set(
        [dto.repartidorRecogidaId, dto.repartidorEntregaId].filter(Boolean) as string[],
      ),
    ];
    const existentes = await this.prisma.perfilRepartidor.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    if (existentes.length !== ids.length) {
      throw new BadRequestException('Algún repartidor no existe');
    }

    let transicionar = false;
    const datos: Record<string, unknown> = {};
    if (dto.repartidorRecogidaId) datos.repartidorRecogidaId = dto.repartidorRecogidaId;
    if (dto.repartidorEntregaId) datos.repartidorEntregaId = dto.repartidorEntregaId;

    if (pedido.estado === 'PENDIENTE_ASIGNACION' && dto.repartidorRecogidaId) {
      PedidoMaquinaEstados.validarTransicion(pedido.estado, 'ASIGNADO');
      datos.estado = 'ASIGNADO';
      transicionar = true;
    }

    const actualizado = await this.prisma.$transaction(async (tx) => {
      const p = await tx.pedido.update({ where: { id: pedidoId }, data: datos });
      if (transicionar) {
        await tx.eventoPedido.create({
          data: {
            pedidoId,
            estado: 'ASIGNADO',
            actorId: usuario.id,
            notas: `Asignado manualmente por admin`,
          },
        });
      }
      return p;
    });

    if (transicionar) {
      this.eventos.emit(
        EventosDominio.PedidoEstadoCambiado,
        new PedidoEstadoCambiadoEvento(
          pedidoId,
          'PENDIENTE_ASIGNACION',
          'ASIGNADO',
          usuario.id,
          new Date(),
        ),
      );
    }
    return actualizado;
  }

  async asignarAutomaticoBatch(actorId: string) {
    const pendientes = await this.prisma.pedido.findMany({
      where: { estado: 'PENDIENTE_ASIGNACION' },
      select: { id: true },
    });
    let asignados = 0;
    const pendientesFinales: string[] = [];
    for (const p of pendientes) {
      const resultado = await this.asignar(p.id, actorId);
      if (resultado.asignado) asignados++;
      else pendientesFinales.push(p.id);
    }
    return {
      procesados: pendientes.length,
      asignados,
      pendientes: pendientesFinales.length,
    };
  }
}
