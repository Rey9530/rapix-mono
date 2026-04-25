import { Module } from '@nestjs/common';
import { ReportesControlador } from './reportes.controlador.js';
import { ReportesServicio } from './reportes.servicio.js';

@Module({
  controllers: [ReportesControlador],
  providers: [ReportesServicio],
  exports: [ReportesServicio],
})
export class ReportesModulo {}
