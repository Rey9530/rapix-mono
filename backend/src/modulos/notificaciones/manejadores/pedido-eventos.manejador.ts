import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventosDominio } from '../../../eventos/eventos-dominio.js';
import { PedidoCreadoEvento } from '../../../eventos/pedido-creado.evento.js';
import { PedidoEstadoCambiadoEvento } from '../../../eventos/pedido-estado-cambiado.evento.js';
import { PrismaServicio } from '../../../prisma/prisma.servicio.js';
import { NotificacionesServicio } from '../notificaciones.servicio.js';
import {
  ClavePlantilla,
  renderizarPlantilla,
} from '../plantillas/es.js';

interface PedidoConDestinatarios {
  id: string;
  codigoSeguimiento: string;
  emailCliente: string | null;
  telefonoCliente: string;
  estado: string;
  motivoFallo: string | null;
  motivoCancelado: string | null;
  vendedor: { usuario: { id: string } };
  repartidorRecogida: { usuario: { id: string } } | null;
  repartidorEntrega: { usuario: { id: string } } | null;
}

@Injectable()
export class PedidoEventosManejador {
  private readonly logger = new Logger(PedidoEventosManejador.name);

  constructor(
    private readonly notif: NotificacionesServicio,
    private readonly prisma: PrismaServicio,
  ) {}

  @OnEvent(EventosDominio.PedidoCreado, { async: true })
  async alCrear(evento: PedidoCreadoEvento): Promise<void> {
    const pedido = await this.cargarPedido(evento.pedidoId);
    if (!pedido) return;

    // Vendedor → EMAIL
    await this.enviarPlantilla('PEDIDO_CREADO_VENDEDOR', pedido.vendedor.usuario.id, ['EMAIL'], [
      pedido.codigoSeguimiento,
    ]);

    // Cliente → WHATSAPP (sin usuario en el sistema; va por destino)
    await this.enviarClienteWhatsapp(
      pedido,
      'PEDIDO_CREADO_CLIENTE',
      [pedido.codigoSeguimiento],
    );
  }

  @OnEvent(EventosDominio.PedidoEstadoCambiado, { async: true })
  async alCambiarEstado(evento: PedidoEstadoCambiadoEvento): Promise<void> {
    const pedido = await this.cargarPedido(evento.pedidoId);
    if (!pedido) return;
    const cs = pedido.codigoSeguimiento;

    switch (evento.hacia) {
      case 'ASIGNADO':
        await this.enviarPlantilla('PEDIDO_ASIGNADO_VENDEDOR', pedido.vendedor.usuario.id, ['PUSH'], [cs]);
        if (pedido.repartidorRecogida) {
          await this.enviarPlantilla(
            'PEDIDO_ASIGNADO_REPARTIDOR',
            pedido.repartidorRecogida.usuario.id,
            ['PUSH'],
            [cs],
          );
        }
        break;

      case 'RECOGIDO':
        await this.enviarPlantilla('PEDIDO_RECOGIDO_VENDEDOR', pedido.vendedor.usuario.id, ['PUSH'], [cs]);
        await this.enviarClienteWhatsapp(pedido, 'PEDIDO_RECOGIDO_CLIENTE', [cs]);
        // PUSH al cliente: solo aplica si tuviéramos Usuario; lo omitimos.
        break;

      case 'EN_TRANSITO':
        await this.enviarClienteWhatsapp(pedido, 'PEDIDO_EN_TRANSITO_CLIENTE', [cs]);
        break;

      case 'EN_REPARTO':
        await this.enviarPlantilla('PEDIDO_EN_REPARTO_VENDEDOR', pedido.vendedor.usuario.id, ['PUSH'], [cs]);
        await this.enviarClienteWhatsapp(pedido, 'PEDIDO_EN_REPARTO_CLIENTE', [cs]);
        break;

      case 'ENTREGADO':
        await this.enviarPlantilla(
          'PEDIDO_ENTREGADO_VENDEDOR',
          pedido.vendedor.usuario.id,
          ['PUSH', 'EMAIL'],
          [cs],
        );
        if (pedido.emailCliente) {
          await this.enviarClienteEmail(pedido.emailCliente, 'PEDIDO_ENTREGADO_CLIENTE', [cs]);
        }
        break;

      case 'FALLIDO':
        await this.enviarPlantilla(
          'PEDIDO_FALLIDO_VENDEDOR',
          pedido.vendedor.usuario.id,
          ['PUSH'],
          [cs, pedido.motivoFallo ?? 'sin detalle'],
        );
        await this.enviarClienteWhatsapp(pedido, 'PEDIDO_FALLIDO_CLIENTE', [cs]);
        await this.enviarAdmins('PEDIDO_FALLIDO_ADMIN', ['PUSH'], [cs, pedido.motivoFallo ?? 'sin detalle']);
        break;

      case 'CANCELADO':
        await this.enviarPlantilla('PEDIDO_CANCELADO_VENDEDOR', pedido.vendedor.usuario.id, ['PUSH'], [cs]);
        if (pedido.repartidorRecogida) {
          await this.enviarPlantilla(
            'PEDIDO_CANCELADO_REPARTIDOR',
            pedido.repartidorRecogida.usuario.id,
            ['PUSH'],
            [cs],
          );
        }
        await this.enviarClienteWhatsapp(pedido, 'PEDIDO_CANCELADO_CLIENTE', [cs]);
        break;

      default:
        break;
    }
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  private async cargarPedido(pedidoId: string): Promise<PedidoConDestinatarios | null> {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id: pedidoId },
      select: {
        id: true,
        codigoSeguimiento: true,
        emailCliente: true,
        telefonoCliente: true,
        estado: true,
        motivoFallo: true,
        motivoCancelado: true,
        vendedor: { select: { usuario: { select: { id: true } } } },
        repartidorRecogida: { select: { usuario: { select: { id: true } } } },
        repartidorEntrega: { select: { usuario: { select: { id: true } } } },
      },
    });
    return pedido as PedidoConDestinatarios | null;
  }

  private async enviarPlantilla(
    clave: ClavePlantilla,
    usuarioId: string | null,
    canales: ('PUSH' | 'WHATSAPP' | 'EMAIL')[],
    params: Array<string | number>,
  ): Promise<void> {
    const { titulo, cuerpo } = renderizarPlantilla(clave, params);
    await this.notif.enviarMulticanal(usuarioId, canales, titulo, cuerpo, { plantillaClave: clave });
  }

  private async enviarClienteWhatsapp(
    pedido: PedidoConDestinatarios,
    clave: ClavePlantilla,
    params: Array<string | number>,
  ): Promise<void> {
    const { titulo, cuerpo } = renderizarPlantilla(clave, params);
    await this.notif.enviar({
      usuarioId: null,
      canal: 'WHATSAPP',
      titulo,
      cuerpo,
      datos: { plantillaClave: clave, telefono: pedido.telefonoCliente },
      destino: pedido.telefonoCliente,
    });
  }

  private async enviarClienteEmail(
    email: string,
    clave: ClavePlantilla,
    params: Array<string | number>,
  ): Promise<void> {
    const { titulo, cuerpo } = renderizarPlantilla(clave, params);
    await this.notif.enviar({
      usuarioId: null,
      canal: 'EMAIL',
      titulo,
      cuerpo,
      datos: { plantillaClave: clave },
      destino: email,
    });
  }

  private async enviarAdmins(
    clave: ClavePlantilla,
    canales: ('PUSH' | 'WHATSAPP' | 'EMAIL')[],
    params: Array<string | number>,
  ): Promise<void> {
    const admins = await this.prisma.usuario.findMany({
      where: { rol: 'ADMIN', estado: 'ACTIVO' },
      select: { id: true },
    });
    for (const admin of admins) {
      await this.enviarPlantilla(clave, admin.id, canales, params);
    }
  }
}
