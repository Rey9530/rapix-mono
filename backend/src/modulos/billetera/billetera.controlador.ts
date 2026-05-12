import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { BilleteraServicio } from './billetera.servicio.js';
import { FiltrosHistorialDto } from './dto/filtros-historial.dto.js';

@ApiTags('Billetera Rider')
@ApiBearerAuth('autenticacion-jwt')
@Controller('billetera')
export class BilleteraControlador {
  constructor(private readonly servicio: BilleteraServicio) {}

  @Roles('REPARTIDOR')
  @Get('yo/pendientes')
  @ApiOperation({
    summary: 'Movimientos pendientes (sin cierre) del rider autenticado',
  })
  pendientes(@UsuarioActual() usuario: Usuario) {
    return this.servicio.listarPendientes(usuario);
  }

  @Roles('REPARTIDOR')
  @Get('yo/saldo-pendiente')
  @ApiOperation({ summary: 'Total y cantidad de movimientos pendientes' })
  saldoPendiente(@UsuarioActual() usuario: Usuario) {
    return this.servicio.obtenerSaldoPendiente(usuario);
  }

  @Roles('REPARTIDOR')
  @Get('yo/historial')
  @ApiOperation({
    summary: 'Historial paginado de movimientos del rider (incluye cierres)',
  })
  historial(
    @UsuarioActual() usuario: Usuario,
    @Query() filtros: FiltrosHistorialDto,
  ) {
    return this.servicio.listarHistorial(usuario, filtros);
  }
}
