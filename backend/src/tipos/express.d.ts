import type { Usuario } from '../generated/prisma/client.js';

declare global {
  namespace Express {
    // Passport hidrata `request.user` con el resultado de JwtEstrategia.validate().
    interface User extends Usuario {}
  }
}

export {};
