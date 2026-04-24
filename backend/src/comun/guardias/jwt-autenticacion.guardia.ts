import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CLAVE_PUBLICO } from '../decoradores/publico.decorador.js';

@Injectable()
export class JwtAutenticacionGuardia extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(contexto: ExecutionContext) {
    const esPublico = this.reflector.getAllAndOverride<boolean>(CLAVE_PUBLICO, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (esPublico) return true;
    return super.canActivate(contexto);
  }

  // Passport por defecto pone el resultado de validate() en request.user.
  // El codebase usa convención hispana: también exponemos request.usuario.
  handleRequest<T = unknown>(err: unknown, usuario: T): T {
    if (err || !usuario) {
      throw err instanceof Error ? err : new UnauthorizedException();
    }
    return usuario;
  }
}
