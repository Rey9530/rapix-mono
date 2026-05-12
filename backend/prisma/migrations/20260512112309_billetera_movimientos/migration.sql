/*
  Warnings:

  - You are about to drop the `cierres_financieros_pedidos` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoMovimientoCaja" AS ENUM ('COBRO_RECOGIDA', 'COBRO_ENTREGA');

-- DropForeignKey
ALTER TABLE "cierres_financieros_pedidos" DROP CONSTRAINT "cierres_financieros_pedidos_cierreId_fkey";

-- DropForeignKey
ALTER TABLE "cierres_financieros_pedidos" DROP CONSTRAINT "cierres_financieros_pedidos_pedidoId_fkey";

-- DropTable
DROP TABLE "cierres_financieros_pedidos";

-- CreateTable
CREATE TABLE "movimientos_caja_repartidor" (
    "id" TEXT NOT NULL,
    "repartidorId" TEXT NOT NULL,
    "pedidoId" TEXT,
    "cierreId" TEXT,
    "tipo" "TipoMovimientoCaja" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "descripcion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_caja_repartidor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movimientos_caja_repartidor_repartidorId_cierreId_idx" ON "movimientos_caja_repartidor"("repartidorId", "cierreId");

-- CreateIndex
CREATE INDEX "movimientos_caja_repartidor_repartidorId_creadoEn_idx" ON "movimientos_caja_repartidor"("repartidorId", "creadoEn");

-- AddForeignKey
ALTER TABLE "movimientos_caja_repartidor" ADD CONSTRAINT "movimientos_caja_repartidor_repartidorId_fkey" FOREIGN KEY ("repartidorId") REFERENCES "perfiles_repartidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja_repartidor" ADD CONSTRAINT "movimientos_caja_repartidor_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja_repartidor" ADD CONSTRAINT "movimientos_caja_repartidor_cierreId_fkey" FOREIGN KEY ("cierreId") REFERENCES "cierres_financieros"("id") ON DELETE SET NULL ON UPDATE CASCADE;
