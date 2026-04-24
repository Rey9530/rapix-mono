import { Module } from '@nestjs/common';
import { RepartidoresModulo } from '../repartidores/repartidores.modulo.js';
import { UsuariosControlador } from './usuarios.controlador.js';
import { UsuariosServicio } from './usuarios.servicio.js';

@Module({
  imports: [RepartidoresModulo],
  controllers: [UsuariosControlador],
  providers: [UsuariosServicio],
  exports: [UsuariosServicio],
})
export class UsuariosModulo {}
