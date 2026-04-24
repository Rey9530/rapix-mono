import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Usuario } from '../../generated/prisma/client.js';

export const UsuarioActual = createParamDecorator(
  (_datos: unknown, ctx: ExecutionContext): Usuario => {
    const peticion = ctx.switchToHttp().getRequest();
    // Passport pone el resultado de JwtEstrategia.validate() en `request.user`.
    return peticion.user;
  },
);
