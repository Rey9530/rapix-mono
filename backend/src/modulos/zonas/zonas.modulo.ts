import { Module } from '@nestjs/common';
import { GeoServicio } from './geo.servicio.js';
import { ZonasControlador } from './zonas.controlador.js';
import { ZonasServicio } from './zonas.servicio.js';

@Module({
  controllers: [ZonasControlador],
  providers: [ZonasServicio, GeoServicio],
  exports: [ZonasServicio, GeoServicio],
})
export class ZonasModulo {}
