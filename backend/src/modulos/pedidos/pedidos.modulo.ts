import { Module } from '@nestjs/common';
import { PaquetesRecargadosModulo } from '../paquetes-recargados/paquetes-recargados.modulo.js';
import { ZonasModulo } from '../zonas/zonas.modulo.js';
import { AsignacionServicio } from './asignacion.servicio.js';
import { CodigoSeguimientoServicio } from './codigo-seguimiento.servicio.js';
import { GoogleMapsServicio } from './google-maps.servicio.js';
import { PedidosControlador } from './pedidos.controlador.js';
import { PedidosServicio } from './pedidos.servicio.js';

@Module({
  imports: [ZonasModulo, PaquetesRecargadosModulo],
  controllers: [PedidosControlador],
  providers: [
    PedidosServicio,
    AsignacionServicio,
    CodigoSeguimientoServicio,
    GoogleMapsServicio,
  ],
  exports: [PedidosServicio],
})
export class PedidosModulo {}
