-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE_ASIGNACION', 'ASIGNADO', 'RECOGIDO', 'EN_TRANSITO', 'EN_PUNTO_INTERCAMBIO', 'EN_REPARTO', 'ENTREGADO', 'CANCELADO', 'FALLIDO', 'DEVUELTO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('CONTRA_ENTREGA', 'PREPAGADO', 'TARJETA', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "ModoFacturacion" AS ENUM ('POR_ENVIO', 'PAQUETE');

-- NO-OP: Prisma intentó dropear el índice GIST sobre poligono porque la columna
-- es `Unsupported` y el introspector no lo detecta. Lo dejamos en pie.

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "codigoSeguimiento" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE_ASIGNACION',
    "nombreCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT NOT NULL,
    "emailCliente" TEXT,
    "direccionOrigen" TEXT NOT NULL,
    "latitudOrigen" DOUBLE PRECISION NOT NULL,
    "longitudOrigen" DOUBLE PRECISION NOT NULL,
    "zonaOrigenId" TEXT,
    "notasOrigen" TEXT,
    "direccionDestino" TEXT NOT NULL,
    "latitudDestino" DOUBLE PRECISION NOT NULL,
    "longitudDestino" DOUBLE PRECISION NOT NULL,
    "zonaDestinoId" TEXT,
    "notasDestino" TEXT,
    "descripcionPaquete" TEXT,
    "pesoPaqueteKg" DECIMAL(6,2),
    "valorDeclarado" DECIMAL(10,2),
    "metodoPago" "MetodoPago" NOT NULL,
    "modoFacturacion" "ModoFacturacion" NOT NULL DEFAULT 'POR_ENVIO',
    "costoEnvio" DECIMAL(10,2) NOT NULL,
    "montoContraEntrega" DECIMAL(10,2),
    "paqueteRecargadoId" TEXT,
    "repartidorRecogidaId" TEXT,
    "repartidorEntregaId" TEXT,
    "programadoPara" TIMESTAMP(3),
    "recogidoEn" TIMESTAMP(3),
    "enIntercambioEn" TIMESTAMP(3),
    "entregadoEn" TIMESTAMP(3),
    "canceladoEn" TIMESTAMP(3),
    "motivoCancelado" TEXT,
    "motivoFallo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_pedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL,
    "actorId" TEXT,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comprobantes_entrega" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "urlFoto" TEXT NOT NULL,
    "urlFirma" TEXT,
    "recibidoPor" TEXT,
    "notas" TEXT,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comprobantes_entrega_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_codigoSeguimiento_key" ON "pedidos"("codigoSeguimiento");

-- CreateIndex
CREATE INDEX "pedidos_estado_idx" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX "pedidos_vendedorId_creadoEn_idx" ON "pedidos"("vendedorId", "creadoEn");

-- CreateIndex
CREATE INDEX "pedidos_repartidorRecogidaId_idx" ON "pedidos"("repartidorRecogidaId");

-- CreateIndex
CREATE INDEX "pedidos_repartidorEntregaId_idx" ON "pedidos"("repartidorEntregaId");

-- CreateIndex
CREATE INDEX "eventos_pedido_pedidoId_creadoEn_idx" ON "eventos_pedido"("pedidoId", "creadoEn");

-- CreateIndex
CREATE INDEX "comprobantes_entrega_pedidoId_idx" ON "comprobantes_entrega"("pedidoId");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "perfiles_vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_zonaOrigenId_fkey" FOREIGN KEY ("zonaOrigenId") REFERENCES "zonas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_zonaDestinoId_fkey" FOREIGN KEY ("zonaDestinoId") REFERENCES "zonas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_repartidorRecogidaId_fkey" FOREIGN KEY ("repartidorRecogidaId") REFERENCES "perfiles_repartidor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_repartidorEntregaId_fkey" FOREIGN KEY ("repartidorEntregaId") REFERENCES "perfiles_repartidor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_pedido" ADD CONSTRAINT "eventos_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprobantes_entrega" ADD CONSTRAINT "comprobantes_entrega_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Secuencia de Tarea 3.3 (codigoSeguimiento DEL-YYYY-NNNNN)
CREATE SEQUENCE IF NOT EXISTS pedidos_secuencia START 1;
