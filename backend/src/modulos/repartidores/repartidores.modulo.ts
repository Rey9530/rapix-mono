import { Module } from '@nestjs/common';
import { NotificacionesModulo } from '../notificaciones/notificaciones.modulo.js';
import { RepartidoresControlador } from './repartidores.controlador.js';
import { RepartidoresServicio } from './repartidores.servicio.js';

@Module({
  imports: [NotificacionesModulo],
  controllers: [RepartidoresControlador],
  providers: [RepartidoresServicio],
  exports: [RepartidoresServicio],
})
export class RepartidoresModulo {}
