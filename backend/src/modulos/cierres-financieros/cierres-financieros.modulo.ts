import { Module } from '@nestjs/common';
import { ArchivosModulo } from '../archivos/archivos.modulo.js';
import { CierresFinancierosControlador } from './cierres-financieros.controlador.js';
import { CierresFinancierosServicio } from './cierres-financieros.servicio.js';

@Module({
  imports: [ArchivosModulo],
  controllers: [CierresFinancierosControlador],
  providers: [CierresFinancierosServicio],
  exports: [CierresFinancierosServicio],
})
export class CierresFinancierosModulo {}
