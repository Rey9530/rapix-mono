-- CreateExtension
-- PostGIS: motor geoespacial para zonas (columnas geometry/geography en Fase 2).
-- uuid-ossp: funciones uuid_generate_v4() para generación server-side de UUIDs.
-- IF NOT EXISTS deja la migración idempotente: la imagen postgis/postgis ya trae
-- PostGIS preinstalado, y postgres vanilla las crea al aplicar.
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'VENDEDOR', 'REPARTIDOR', 'CLIENTE');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'PENDIENTE_VERIFICACION');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "hashContrasena" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE_VERIFICACION',
    "urlAvatar" TEXT,
    "ultimoIngresoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_refresco" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "revocadoEn" TIMESTAMP(3),
    "userAgent" TEXT,
    "direccionIp" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_refresco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_admin" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "permisos" TEXT[],

    CONSTRAINT "perfiles_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefono_key" ON "usuarios"("telefono");

-- CreateIndex
CREATE INDEX "usuarios_rol_estado_idx" ON "usuarios"("rol", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refresco_token_key" ON "tokens_refresco"("token");

-- CreateIndex
CREATE INDEX "tokens_refresco_usuarioId_idx" ON "tokens_refresco"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_admin_usuarioId_key" ON "perfiles_admin"("usuarioId");

-- AddForeignKey
ALTER TABLE "tokens_refresco" ADD CONSTRAINT "tokens_refresco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_admin" ADD CONSTRAINT "perfiles_admin_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
