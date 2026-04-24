// Seed de desarrollo — idempotente via upsert.
// Poblado soportado hoy:
//   - Admin raíz (+ PerfilAdmin)
//   - 2 vendedores (el PerfilVendedor se persistirá cuando llegue Tarea 2.1)
//   - 3 repartidores (el PerfilRepartidor se persistirá cuando llegue Tarea 2.4)
// Pendiente:
//   - 2 reglas de tarifa — el modelo `ReglaTarifa` entra en Tarea 4.1.
//     Mientras tanto, la sección queda comentada abajo.
//
// Ejecución: `yarn prisma:seed` (o `yarn prisma db seed` — Prisma 7 lee el
// comando desde `prisma.config.ts#migrations.seed`).

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

interface DatosUsuario {
  email: string;
  telefono: string;
  contrasena: string;
  nombreCompleto: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'REPARTIDOR';
}

const ADMIN: DatosUsuario = {
  email: 'admin@delivery.com',
  telefono: '+50370000000',
  contrasena: 'Admin123!',
  nombreCompleto: 'Administrador Raíz',
  rol: 'ADMIN',
};

const VENDEDORES: DatosUsuario[] = [
  {
    email: 'vendedor1@delivery.com',
    telefono: '+50370010001',
    contrasena: 'Vendedor123!',
    nombreCompleto: 'Tienda Uno',
    rol: 'VENDEDOR',
  },
  {
    email: 'vendedor2@delivery.com',
    telefono: '+50370010002',
    contrasena: 'Vendedor123!',
    nombreCompleto: 'Tienda Dos',
    rol: 'VENDEDOR',
  },
];

const REPARTIDORES: DatosUsuario[] = [
  {
    email: 'repartidor1@delivery.com',
    telefono: '+50370020001',
    contrasena: 'Repartidor123!',
    nombreCompleto: 'Carlos Recogedor',
    rol: 'REPARTIDOR',
  },
  {
    email: 'repartidor2@delivery.com',
    telefono: '+50370020002',
    contrasena: 'Repartidor123!',
    nombreCompleto: 'María Repartidora',
    rol: 'REPARTIDOR',
  },
  {
    email: 'repartidor3@delivery.com',
    telefono: '+50370020003',
    contrasena: 'Repartidor123!',
    nombreCompleto: 'Pedro Ciclista',
    rol: 'REPARTIDOR',
  },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function upsertUsuarioBasico(datos: DatosUsuario): Promise<string> {
  const hash = await bcrypt.hash(datos.contrasena, 12);
  const usuario = await prisma.usuario.upsert({
    where: { email: datos.email },
    update: {},
    create: {
      email: datos.email,
      telefono: datos.telefono,
      hashContrasena: hash,
      nombreCompleto: datos.nombreCompleto,
      rol: datos.rol,
      estado: 'ACTIVO',
    },
  });
  return usuario.id;
}

async function main() {
  const adminId = await upsertUsuarioBasico(ADMIN);
  await prisma.perfilAdmin.upsert({
    where: { usuarioId: adminId },
    update: {},
    create: { usuarioId: adminId, permisos: ['*'] },
  });
  console.log(`Admin raíz listo: ${ADMIN.email} (id=${adminId})`);

  for (const v of VENDEDORES) {
    const id = await upsertUsuarioBasico(v);
    console.log(`Vendedor listo: ${v.email} (id=${id}) — PerfilVendedor pendiente 2.1`);
  }

  for (const r of REPARTIDORES) {
    const id = await upsertUsuarioBasico(r);
    console.log(`Repartidor listo: ${r.email} (id=${id}) — PerfilRepartidor pendiente 2.4`);
  }

  // Reglas de tarifa — el modelo ReglaTarifa entra en Tarea 4.1.
  // Ejemplos:
  //   - POR_ENVIO: $3.00
  //   - PAQUETE: 100 envíos por $250
  // Se insertarán aquí (también con upsert) cuando el modelo exista.

  console.log('\nSeed completado.');
}

main()
  .catch((error) => {
    console.error('Seed falló:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
