import { PrismaClient } from './src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: 'postgresql://postgres:postgres@localhost:5422/delivery?schema=public' });
const prisma = new PrismaClient({ adapter });

const convs = await prisma.confirmacionEntregaConversacion.findMany({
  orderBy: { iniciadaEn: 'desc' },
  take: 3,
  include: {
    pedido: {
      select: {
        codigoSeguimiento: true,
        estado: true,
        nombreCliente: true,
        telefonoCliente: true,
        latitudDestino: true,
        longitudDestino: true,
        direccionDestino: true,
        zonaDestinoId: true,
      },
    },
    intercambios: {
      orderBy: { creadoEn: 'asc' },
      select: {
        rol: true,
        texto: true,
        intencionClasificada: true,
        creadoEn: true,
      },
    },
  },
});

console.log(JSON.stringify(convs, null, 2));
await prisma.$disconnect();
