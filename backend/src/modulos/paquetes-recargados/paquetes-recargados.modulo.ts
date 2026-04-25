import { Module } from '@nestjs/common';
import { FacturacionServicio } from './facturacion.servicio.js';
import { PaquetesCronServicio } from './paquetes-cron.servicio.js';
import { PaquetesRecargadosControlador } from './paquetes-recargados.controlador.js';
import { PaquetesRecargadosServicio } from './paquetes-recargados.servicio.js';

@Module({
  controllers: [PaquetesRecargadosControlador],
  providers: [PaquetesRecargadosServicio, FacturacionServicio, PaquetesCronServicio],
  exports: [PaquetesRecargadosServicio, FacturacionServicio],
})
export class PaquetesRecargadosModulo {}
