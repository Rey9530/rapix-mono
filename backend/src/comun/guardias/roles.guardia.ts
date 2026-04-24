import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CLAVE_ROLES } from '../decoradores/roles.decorador.js';

@Injectable()
export class RolesGuardia implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const requeridos = this.reflector.getAllAndOverride<string[]>(CLAVE_ROLES, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (!requeridos || requeridos.length === 0) return true;

    const { usuario } = contexto.switchToHttp().getRequest();
    return !!usuario && requeridos.includes(usuario.rol);
  }
}
