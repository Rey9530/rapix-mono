import { Module } from '@nestjs/common';
import { BancosControlador } from './bancos.controlador.js';
import { BancosServicio } from './bancos.servicio.js';
import { CuentasBancariasControlador } from './cuentas-bancarias.controlador.js';
import { CuentasBancariasServicio } from './cuentas-bancarias.servicio.js';

@Module({
  controllers: [BancosControlador, CuentasBancariasControlador],
  providers: [BancosServicio, CuentasBancariasServicio],
  exports: [BancosServicio, CuentasBancariasServicio],
})
export class CuentasBancariasModulo {}
