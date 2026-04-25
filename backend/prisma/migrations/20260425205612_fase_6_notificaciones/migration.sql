-- CreateEnum
CREATE TYPE "CanalNotificacion" AS ENUM ('PUSH', 'WHATSAPP', 'EMAIL');

-- CreateEnum
CREATE TYPE "EstadoNotificacion" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO', 'LEIDO');

-- CreateEnum
CREATE TYPE "PlataformaDispositivo" AS ENUM ('ANDROID', 'IOS', 'WEB');

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "canal" "CanalNotificacion" NOT NULL,
    "estado" "EstadoNotificacion" NOT NULL DEFAULT 'PENDIENTE',
    "titulo" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "datos" JSONB,
    "destino" TEXT,
    "enviadoEn" TIMESTAMP(3),
    "leidoEn" TIMESTAMP(3),
    "mensajeError" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_dispositivo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "plataforma" "PlataformaDispositivo" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_dispositivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notificaciones_usuarioId_creadoEn_idx" ON "notificaciones"("usuarioId", "creadoEn");

-- CreateIndex
CREATE INDEX "notificaciones_estado_idx" ON "notificaciones"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_dispositivo_token_key" ON "tokens_dispositivo"("token");

-- CreateIndex
CREATE INDEX "tokens_dispositivo_usuarioId_activo_idx" ON "tokens_dispositivo"("usuarioId", "activo");

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_dispositivo" ADD CONSTRAINT "tokens_dispositivo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
