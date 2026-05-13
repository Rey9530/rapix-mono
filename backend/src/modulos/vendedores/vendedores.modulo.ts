import { Module } from '@nestjs/common';
import { VendedoresControlador } from './vendedores.controlador.js';
import { VendedoresServicio } from './vendedores.servicio.js';

@Module({
  controllers: [VendedoresControlador],
  providers: [VendedoresServicio],
  exports: [VendedoresServicio],
})
export class VendedoresModulo {}
