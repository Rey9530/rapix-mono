import { Module } from '@nestjs/common';
import { RepartidoresControlador } from './repartidores.controlador.js';
import { RepartidoresServicio } from './repartidores.servicio.js';

@Module({
  controllers: [RepartidoresControlador],
  providers: [RepartidoresServicio],
  exports: [RepartidoresServicio],
})
export class RepartidoresModulo {}
