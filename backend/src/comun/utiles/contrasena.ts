import bcrypt from 'bcrypt';

const COSTO_BCRYPT = 12;

export async function hashearContrasena(plano: string): Promise<string> {
  return bcrypt.hash(plano, COSTO_BCRYPT);
}

export async function compararContrasena(plano: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plano, hash);
}
