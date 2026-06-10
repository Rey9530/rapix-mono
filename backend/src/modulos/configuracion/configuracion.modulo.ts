import { Module } from '@nestjs/common';
import { ConfiguracionControlador } from './configuracion.controlador.js';
import { ConfiguracionServicio } from './configuracion.servicio.js';

@Module({
  controllers: [ConfiguracionControlador],
  providers: [ConfiguracionServicio],
  exports: [ConfiguracionServicio],
})
export class ConfiguracionModulo {}
