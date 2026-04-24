import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const hash = await bcrypt.hash('Admin123!', 10);

  await prisma.usuario.upsert({
    where: { email: 'admin@delivery.com' },
    update: {},
    create: {
      email: 'admin@delivery.com',
      hashContrasena: hash,
      nombre: 'Administrador',
      rol: 'ADMIN',
    },
  });

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
