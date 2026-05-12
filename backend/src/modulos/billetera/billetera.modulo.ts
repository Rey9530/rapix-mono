import { Module } from '@nestjs/common';
import { BilleteraControlador } from './billetera.controlador.js';
import { BilleteraServicio } from './billetera.servicio.js';

@Module({
  controllers: [BilleteraControlador],
  providers: [BilleteraServicio],
  exports: [BilleteraServicio],
})
export class BilleteraModulo {}
