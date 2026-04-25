import { Global, Module } from '@nestjs/common';
import { ArchivosServicio } from './archivos.servicio.js';

@Global()
@Module({
  providers: [ArchivosServicio],
  exports: [ArchivosServicio],
})
export class ArchivosModulo {}
