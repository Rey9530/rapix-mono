-- CreateEnum
CREATE TYPE "AplicacionMovil" AS ENUM ('CLIENTES', 'REPARTIDORES');

-- CreateTable
CREATE TABLE "versiones_app" (
    "id" TEXT NOT NULL,
    "aplicacion" "AplicacionMovil" NOT NULL,
    "versionMinima" TEXT NOT NULL,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "versiones_app_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "versiones_app_aplicacion_key" ON "versiones_app"("aplicacion");
