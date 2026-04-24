import { Global, Module } from '@nestjs/common';
import { PrismaServicio } from './prisma.servicio.js';

@Global()
@Module({
  providers: [PrismaServicio],
  exports: [PrismaServicio],
})
export class PrismaModulo {}
