// Runner de tests e2e — prepara la BD de test y lanza Jest.
//   1. Garantiza que delivery_test existe (vía docker exec en backend-postgres-1).
//   2. Aplica las migraciones sobre la BD de test.
//   3. Lanza Jest con DATABASE_URL de test y NODE_OPTIONS=--experimental-vm-modules.
//
// Uso: `yarn test:e2e` (o `node test/correr-e2e.js`).

import { execSync } from 'node:child_process';

const NOMBRE_BD = 'delivery_test';
const CONTENEDOR = process.env.POSTGRES_CONTAINER ?? 'backend-postgres-1';
const URL_BD_TEST =
  process.env.DATABASE_URL_TEST ??
  `postgresql://postgres:postgres@localhost:5422/${NOMBRE_BD}?schema=public`;

function correr(comando, opciones = {}) {
  return execSync(comando, { stdio: 'inherit', ...opciones });
}

function existeBd() {
  try {
    const salida = execSync(
      `docker exec ${CONTENEDOR} psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '${NOMBRE_BD}'"`,
      { encoding: 'utf8' },
    ).trim();
    return salida === '1';
  } catch {
    return false;
  }
}

if (!existeBd()) {
  console.log(`[e2e] Creando BD ${NOMBRE_BD}`);
  correr(`docker exec ${CONTENEDOR} psql -U postgres -c "CREATE DATABASE ${NOMBRE_BD}"`);
}

console.log('[e2e] Aplicando migraciones en BD de test');
correr('npx prisma migrate deploy', { env: { ...process.env, DATABASE_URL: URL_BD_TEST } });

console.log('[e2e] Ejecutando Jest');
correr('npx jest --config test/jest-e2e.json', {
  env: {
    ...process.env,
    DATABASE_URL: URL_BD_TEST,
    NODE_ENV: 'test',
    NODE_OPTIONS: '--experimental-vm-modules',
  },
});
