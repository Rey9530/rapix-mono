-- CreateEnum
CREATE TYPE "EstadoSesionWhatsapp" AS ENUM ('DESCONECTADA', 'ESPERANDO_QR', 'CONECTADA', 'EXPIRADA', 'BANEADA');

-- CreateEnum
CREATE TYPE "TipoChatWhatsapp" AS ENUM ('INDIVIDUAL', 'GRUPO');

-- CreateEnum
CREATE TYPE "DireccionMensajeWhatsapp" AS ENUM ('ENTRANTE', 'SALIENTE');

-- CreateEnum
CREATE TYPE "TipoMensajeWhatsapp" AS ENUM ('TEXTO', 'IMAGEN', 'VIDEO', 'AUDIO', 'DOCUMENTO', 'STICKER', 'UBICACION', 'CONTACTO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "EstadoMensajeWhatsapp" AS ENUM ('PENDIENTE', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'FALLIDO');

-- CreateTable
CREATE TABLE "sesiones_whatsapp" (
    "id" TEXT NOT NULL,
    "estado" "EstadoSesionWhatsapp" NOT NULL DEFAULT 'DESCONECTADA',
    "jidPropio" TEXT,
    "numeroPropio" TEXT,
    "nombrePropio" TEXT,
    "qrActual" TEXT,
    "qrExpiraEn" TIMESTAMP(3),
    "ultimoErrorEn" TIMESTAMP(3),
    "ultimoError" TEXT,
    "conectadoEn" TIMESTAMP(3),
    "desconectadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_state_whatsapp" (
    "id" TEXT NOT NULL,
    "sesionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" JSONB NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_state_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_whatsapp" (
    "id" TEXT NOT NULL,
    "jid" TEXT NOT NULL,
    "numero" TEXT,
    "nombre" TEXT,
    "urlAvatar" TEXT,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "visto" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactos_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats_whatsapp" (
    "id" TEXT NOT NULL,
    "jid" TEXT NOT NULL,
    "tipo" "TipoChatWhatsapp" NOT NULL,
    "nombre" TEXT,
    "urlAvatar" TEXT,
    "ultimoMensajeEn" TIMESTAMP(3),
    "ultimoMensajeId" TEXT,
    "noLeidos" INTEGER NOT NULL DEFAULT 0,
    "archivado" BOOLEAN NOT NULL DEFAULT false,
    "silenciadoHasta" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participantes_grupo_whatsapp" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "contactoId" TEXT NOT NULL,
    "esAdmin" BOOLEAN NOT NULL DEFAULT false,
    "esSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participantes_grupo_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes_whatsapp" (
    "id" TEXT NOT NULL,
    "externoId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "remitenteId" TEXT,
    "direccion" "DireccionMensajeWhatsapp" NOT NULL,
    "tipo" "TipoMensajeWhatsapp" NOT NULL,
    "estado" "EstadoMensajeWhatsapp" NOT NULL DEFAULT 'PENDIENTE',
    "texto" TEXT,
    "caption" TEXT,
    "urlMedia" TEXT,
    "mimeMedia" TEXT,
    "bytesMedia" INTEGER,
    "duracionSeg" INTEGER,
    "nombreArchivo" TEXT,
    "miniatura" TEXT,
    "respondeAId" TEXT,
    "reenviado" BOOLEAN NOT NULL DEFAULT false,
    "enviadoEn" TIMESTAMP(3),
    "entregadoEn" TIMESTAMP(3),
    "leidoEn" TIMESTAMP(3),
    "fallaError" TEXT,
    "payloadCrudo" JSONB,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mensajes_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reacciones_mensaje_whatsapp" (
    "id" TEXT NOT NULL,
    "mensajeId" TEXT NOT NULL,
    "jidAutor" TEXT NOT NULL,
    "emoji" TEXT,
    "reaccionadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reacciones_mensaje_whatsapp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_state_whatsapp_sesionId_tipo_idx" ON "auth_state_whatsapp"("sesionId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "auth_state_whatsapp_sesionId_tipo_clave_key" ON "auth_state_whatsapp"("sesionId", "tipo", "clave");

-- CreateIndex
CREATE UNIQUE INDEX "contactos_whatsapp_jid_key" ON "contactos_whatsapp"("jid");

-- CreateIndex
CREATE INDEX "contactos_whatsapp_numero_idx" ON "contactos_whatsapp"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "chats_whatsapp_jid_key" ON "chats_whatsapp"("jid");

-- CreateIndex
CREATE INDEX "chats_whatsapp_tipo_ultimoMensajeEn_idx" ON "chats_whatsapp"("tipo", "ultimoMensajeEn");

-- CreateIndex
CREATE INDEX "chats_whatsapp_archivado_ultimoMensajeEn_idx" ON "chats_whatsapp"("archivado", "ultimoMensajeEn");

-- CreateIndex
CREATE INDEX "participantes_grupo_whatsapp_chatId_idx" ON "participantes_grupo_whatsapp"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_grupo_whatsapp_chatId_contactoId_key" ON "participantes_grupo_whatsapp"("chatId", "contactoId");

-- CreateIndex
CREATE INDEX "mensajes_whatsapp_chatId_creadoEn_idx" ON "mensajes_whatsapp"("chatId", "creadoEn");

-- CreateIndex
CREATE INDEX "mensajes_whatsapp_direccion_estado_idx" ON "mensajes_whatsapp"("direccion", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "mensajes_whatsapp_chatId_externoId_key" ON "mensajes_whatsapp"("chatId", "externoId");

-- CreateIndex
CREATE INDEX "reacciones_mensaje_whatsapp_mensajeId_idx" ON "reacciones_mensaje_whatsapp"("mensajeId");

-- CreateIndex
CREATE UNIQUE INDEX "reacciones_mensaje_whatsapp_mensajeId_jidAutor_key" ON "reacciones_mensaje_whatsapp"("mensajeId", "jidAutor");

-- AddForeignKey
ALTER TABLE "participantes_grupo_whatsapp" ADD CONSTRAINT "participantes_grupo_whatsapp_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats_whatsapp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_grupo_whatsapp" ADD CONSTRAINT "participantes_grupo_whatsapp_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "contactos_whatsapp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_whatsapp" ADD CONSTRAINT "mensajes_whatsapp_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats_whatsapp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_whatsapp" ADD CONSTRAINT "mensajes_whatsapp_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "contactos_whatsapp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_whatsapp" ADD CONSTRAINT "mensajes_whatsapp_respondeAId_fkey" FOREIGN KEY ("respondeAId") REFERENCES "mensajes_whatsapp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reacciones_mensaje_whatsapp" ADD CONSTRAINT "reacciones_mensaje_whatsapp_mensajeId_fkey" FOREIGN KEY ("mensajeId") REFERENCES "mensajes_whatsapp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
