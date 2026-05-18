-- CreateEnum
CREATE TYPE "EtapaConversacionEntrega" AS ENUM ('CONFIRMACION_INICIAL', 'ESPERANDO_DIRECCION_ORIGINAL', 'CONFIRMANDO_RECHAZO', 'OFRECIENDO_UBICACION_ALTERNATIVA', 'ESPERANDO_NUEVA_UBICACION');

-- AlterTable
ALTER TABLE "confirmaciones_entrega_conversacion" ADD COLUMN     "etapa" "EtapaConversacionEntrega" NOT NULL DEFAULT 'CONFIRMACION_INICIAL',
ADD COLUMN     "latitudOriginal" DOUBLE PRECISION,
ADD COLUMN     "longitudOriginal" DOUBLE PRECISION,
ADD COLUMN     "latitudPropuesta" DOUBLE PRECISION,
ADD COLUMN     "longitudPropuesta" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "zonas" ADD COLUMN     "radioMaxRelocalizacionMetros" INTEGER;
