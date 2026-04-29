import { Module } from '@nestjs/common';
import { ReglasTarifaControlador } from './reglas-tarifa.controlador.js';
import { ReglasTarifaServicio } from './reglas-tarifa.servicio.js';

@Module({
  controllers: [ReglasTarifaControlador],
  providers: [ReglasTarifaServicio],
  exports: [ReglasTarifaServicio],
})
export class ReglasTarifaModulo {}
