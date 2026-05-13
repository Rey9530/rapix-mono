-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "depositoId" TEXT;

-- CreateTable
CREATE TABLE "depositos_vendedor" (
    "id" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "cuentaBancariaId" TEXT,
    "monto" DECIMAL(12,2) NOT NULL,
    "fechaDeposito" TIMESTAMP(3) NOT NULL,
    "referencia" TEXT,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depositos_vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "depositos_vendedor_vendedorId_fechaDeposito_idx" ON "depositos_vendedor"("vendedorId", "fechaDeposito");

-- CreateIndex
CREATE INDEX "pedidos_vendedorId_depositoId_metodoPago_estado_idx" ON "pedidos"("vendedorId", "depositoId", "metodoPago", "estado");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "depositos_vendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depositos_vendedor" ADD CONSTRAINT "depositos_vendedor_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "perfiles_vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depositos_vendedor" ADD CONSTRAINT "depositos_vendedor_cuentaBancariaId_fkey" FOREIGN KEY ("cuentaBancariaId") REFERENCES "cuentas_bancarias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "depositos_vendedor" ADD COLUMN     "urlComprobante" TEXT;

-- CreateEnum
CREATE TYPE "EstadoConfirmacionEntrega" AS ENUM ('INICIADA', 'PROCESANDO', 'REPREGUNTADA', 'RESUELTA', 'EXPIRADA', 'FALLIDA');

-- CreateEnum
CREATE TYPE "IntencionConfirmacion" AS ENUM ('CONFIRMA', 'RECHAZA', 'CONDICIONAL', 'AMBIGUO');

-- CreateEnum
CREATE TYPE "RolMensajeConfirmacion" AS ENUM ('SISTEMA', 'CLIENTE', 'BOT');

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "entregaConfirmada" BOOLEAN,
ADD COLUMN     "fechaContactoCliente" TIMESTAMP(3),
ADD COLUMN     "notaRider" TEXT;

-- CreateTable
CREATE TABLE "confirmaciones_entrega_conversacion" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "chatId" TEXT,
    "estado" "EstadoConfirmacionEntrega" NOT NULL DEFAULT 'INICIADA',
    "intencionFinal" "IntencionConfirmacion",
    "iniciadaEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resueltaEn" TIMESTAMP(3),
    "vencimientoNotificacionEn" TIMESTAMP(3) NOT NULL,
    "notificacionVendedorEnviada" BOOLEAN NOT NULL DEFAULT false,
    "motivoFalla" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "confirmaciones_entrega_conversacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "confirmacion_entrega_intercambios" (
    "id" TEXT NOT NULL,
    "conversacionId" TEXT NOT NULL,
    "rol" "RolMensajeConfirmacion" NOT NULL,
    "texto" TEXT NOT NULL,
    "mensajeWhatsappId" TEXT,
    "intencionClasificada" "IntencionConfirmacion",
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "confirmacion_entrega_intercambios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "confirmaciones_entrega_conversacion_pedidoId_key" ON "confirmaciones_entrega_conversacion"("pedidoId");

-- CreateIndex
CREATE INDEX "confirmaciones_entrega_conversacion_estado_vencimientoNotif_idx" ON "confirmaciones_entrega_conversacion"("estado", "vencimientoNotificacionEn", "notificacionVendedorEnviada");

-- CreateIndex
CREATE INDEX "confirmaciones_entrega_conversacion_chatId_estado_idx" ON "confirmaciones_entrega_conversacion"("chatId", "estado");

-- CreateIndex
CREATE INDEX "confirmacion_entrega_intercambios_conversacionId_creadoEn_idx" ON "confirmacion_entrega_intercambios"("conversacionId", "creadoEn");

-- AddForeignKey
ALTER TABLE "confirmaciones_entrega_conversacion" ADD CONSTRAINT "confirmaciones_entrega_conversacion_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirmaciones_entrega_conversacion" ADD CONSTRAINT "confirmaciones_entrega_conversacion_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats_whatsapp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirmacion_entrega_intercambios" ADD CONSTRAINT "confirmacion_entrega_intercambios_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "confirmaciones_entrega_conversacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "confirmacion_entrega_intercambios" ADD CONSTRAINT "confirmacion_entrega_intercambios_mensajeWhatsappId_fkey" FOREIGN KEY ("mensajeWhatsappId") REFERENCES "mensajes_whatsapp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
