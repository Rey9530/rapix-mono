-- CreateExtension
-- PostGIS: motor geoespacial para zonas de cobertura (columnas geometry/geography).
-- IF NOT EXISTS mantiene la migración idempotente: funciona tanto con la imagen
-- postgis/postgis (extensión ya presente) como con postgres vanilla.
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'OPERADOR', 'CLIENTE', 'REPARTIDOR');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE_ASIGNACION', 'ASIGNADO', 'RECOGIDO', 'EN_TRANSITO', 'EN_PUNTO_INTERCAMBIO', 'EN_REPARTO', 'ENTREGADO', 'FALLIDO', 'CANCELADO', 'DEVUELTO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "hashContrasena" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_refresco" (
    "id" UUID NOT NULL,
    "usuarioId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "revocadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_refresco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refresco_token_key" ON "tokens_refresco"("token");

-- CreateIndex
CREATE INDEX "tokens_refresco_usuarioId_idx" ON "tokens_refresco"("usuarioId");

-- AddForeignKey
ALTER TABLE "tokens_refresco" ADD CONSTRAINT "tokens_refresco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
