import type { UsuarioAutenticado } from '../comun/decoradores/usuario-actual.decorador.js';

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export {};
