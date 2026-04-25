import { Global, Module } from '@nestjs/common';
import { AuditoriaServicio } from './auditoria.servicio.js';

@Global()
@Module({
  providers: [AuditoriaServicio],
  exports: [AuditoriaServicio],
})
export class AuditoriaModulo {}
