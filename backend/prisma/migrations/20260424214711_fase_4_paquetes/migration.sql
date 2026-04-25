-- CreateEnum
CREATE TYPE "EstadoPaquete" AS ENUM ('ACTIVO', 'PENDIENTE_PAGO', 'AGOTADO', 'EXPIRADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "reglas_tarifa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "modoFacturacion" "ModoFacturacion" NOT NULL,
    "precioPorEnvio" DECIMAL(10,2),
    "tamanoPaquete" INTEGER,
    "precioPaquete" DECIMAL(10,2),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "validaDesde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validaHasta" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reglas_tarifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paquetes_recargados" (
    "id" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "reglaTarifaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "enviosTotales" INTEGER NOT NULL,
    "enviosRestantes" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoPaquete" NOT NULL DEFAULT 'ACTIVO',
    "compradoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paquetes_recargados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reglas_tarifa_modoFacturacion_activa_idx" ON "reglas_tarifa"("modoFacturacion", "activa");

-- CreateIndex
CREATE INDEX "paquetes_recargados_vendedorId_estado_idx" ON "paquetes_recargados"("vendedorId", "estado");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_paqueteRecargadoId_fkey" FOREIGN KEY ("paqueteRecargadoId") REFERENCES "paquetes_recargados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paquetes_recargados" ADD CONSTRAINT "paquetes_recargados_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "perfiles_vendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paquetes_recargados" ADD CONSTRAINT "paquetes_recargados_reglaTarifaId_fkey" FOREIGN KEY ("reglaTarifaId") REFERENCES "reglas_tarifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
