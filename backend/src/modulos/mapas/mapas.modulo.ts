import { Module } from '@nestjs/common';
import { MapasControlador } from './mapas.controlador.js';
import { MapasServicio } from './mapas.servicio.js';

@Module({
  controllers: [MapasControlador],
  providers: [MapasServicio],
  exports: [MapasServicio],
})
export class MapasModulo {}
