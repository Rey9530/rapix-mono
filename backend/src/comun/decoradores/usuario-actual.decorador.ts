import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface UsuarioAutenticado {
  id: string;
  rol: string;
}

export const UsuarioActual = createParamDecorator(
  (_datos: unknown, ctx: ExecutionContext): UsuarioAutenticado => {
    const peticion = ctx.switchToHttp().getRequest();
    return peticion.usuario;
  },
);
