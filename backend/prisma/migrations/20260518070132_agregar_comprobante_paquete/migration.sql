-- AlterTable
ALTER TABLE "paquetes_recargados" ADD COLUMN     "comprobanteSubidoEn" TIMESTAMP(3),
ADD COLUMN     "metodoPago" "MetodoPago",
ADD COLUMN     "urlComprobantePago" TEXT;
