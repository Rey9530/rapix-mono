// Seed de desarrollo — idempotente via upsert.
// Pobla:
//   - Admin raíz (+ PerfilAdmin)
//   - 2 vendedores (+ PerfilVendedor con direccion/lat/lng)
//   - 3 repartidores (+ PerfilRepartidor con tipoVehiculo/documentoIdentidad)
//   - 2 reglas de tarifa (POR_ENVIO $3, PAQUETE 100 envíos $250)

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

interface SeedVendedor {
  email: string;
  telefono: string;
  contrasena: string;
  nombreCompleto: string;
  nombreNegocio: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

interface SeedRepartidor {
  email: string;
  telefono: string;
  contrasena: string;
  nombreCompleto: string;
  tipoVehiculo: string;
  placa?: string;
  documentoIdentidad: string;
}

const ADMIN = {
  email: 'admin@delivery.com',
  telefono: '+50370000000',
  contrasena: 'Admin123!',
  nombreCompleto: 'Administrador Raíz',
};

const VENDEDORES: SeedVendedor[] = [
  {
    email: 'vendedor1@delivery.com',
    telefono: '+50370010001',
    contrasena: 'Vendedor123!',
    nombreCompleto: 'Tienda Uno',
    nombreNegocio: 'Tienda Uno',
    direccion: 'Col Escalón #123, San Salvador',
    latitud: 13.6929,
    longitud: -89.2182,
  },
  {
    email: 'vendedor2@delivery.com',
    telefono: '+50370010002',
    contrasena: 'Vendedor123!',
    nombreCompleto: 'Tienda Dos',
    nombreNegocio: 'Tienda Dos',
    direccion: 'Col Roma #45, San Salvador',
    latitud: 13.6950,
    longitud: -89.2200,
  },
];

const REPARTIDORES: SeedRepartidor[] = [
  {
    email: 'repartidor1@delivery.com',
    telefono: '+50370020001',
    contrasena: 'Repartidor123!',
    nombreCompleto: 'Carlos Recogedor',
    tipoVehiculo: 'moto',
    placa: 'M-1001',
    documentoIdentidad: '01234567-1',
  },
  {
    email: 'repartidor2@delivery.com',
    telefono: '+50370020002',
    contrasena: 'Repartidor123!',
    nombreCompleto: 'María Repartidora',
    tipoVehiculo: 'moto',
    placa: 'M-1002',
    documentoIdentidad: '01234567-2',
  },
  {
    email: 'repartidor3@delivery.com',
    telefono: '+50370020003',
    contrasena: 'Repartidor123!',
    nombreCompleto: 'Pedro Ciclista',
    tipoVehiculo: 'bicicleta',
    documentoIdentidad: '01234567-3',
  },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function upsertUsuarioBasico(datos: {
  email: string;
  telefono: string;
  contrasena: string;
  nombreCompleto: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'REPARTIDOR';
}): Promise<string> {
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
  const adminId = await upsertUsuarioBasico({ ...ADMIN, rol: 'ADMIN' });
  await prisma.perfilAdmin.upsert({
    where: { usuarioId: adminId },
    update: {},
    create: { usuarioId: adminId, permisos: ['*'] },
  });
  console.log(`Admin raíz listo: ${ADMIN.email}`);

  for (const v of VENDEDORES) {
    const id = await upsertUsuarioBasico({ ...v, rol: 'VENDEDOR' });
    await prisma.perfilVendedor.upsert({
      where: { usuarioId: id },
      update: {},
      create: {
        usuarioId: id,
        nombreNegocio: v.nombreNegocio,
        direccion: v.direccion,
        latitud: v.latitud,
        longitud: v.longitud,
      },
    });
    console.log(`Vendedor listo: ${v.email}`);
  }

  for (const r of REPARTIDORES) {
    const id = await upsertUsuarioBasico({ ...r, rol: 'REPARTIDOR' });
    await prisma.perfilRepartidor.upsert({
      where: { usuarioId: id },
      update: {},
      create: {
        usuarioId: id,
        tipoVehiculo: r.tipoVehiculo,
        placa: r.placa ?? null,
        documentoIdentidad: r.documentoIdentidad,
      },
    });
    console.log(`Repartidor listo: ${r.email}`);
  }

  await sembrarReglasTarifa();

  console.log('\nSeed completado.');
}

async function sembrarReglasTarifa() {
  const reglas = [
    {
      nombre: 'Tarifa estándar por envío',
      modoFacturacion: 'POR_ENVIO' as const,
      precioPorEnvio: '3.00',
    },
    {
      nombre: 'Paquete 100 envíos',
      modoFacturacion: 'PAQUETE' as const,
      tamanoPaquete: 100,
      precioPaquete: '250.00',
    },
  ];

  for (const r of reglas) {
    const existente = await prisma.reglaTarifa.findFirst({
      where: { nombre: r.nombre, modoFacturacion: r.modoFacturacion },
    });
    if (existente) {
      console.log(`Regla tarifa ya existe: ${r.nombre}`);
      continue;
    }
    await prisma.reglaTarifa.create({ data: { ...r, activa: true } });
    console.log(`Regla tarifa creada: ${r.nombre}`);
  }
}

main()
  .catch((error) => {
    console.error('Seed falló:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
