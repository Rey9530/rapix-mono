-- CreateEnum
CREATE TYPE "EstadoCierreFinanciero" AS ENUM ('PENDIENTE_REVISION', 'APROBADO', 'RECHAZADO', 'CON_DISCREPANCIA');

-- CreateTable
CREATE TABLE "cierres_financieros" (
    "id" TEXT NOT NULL,
    "repartidorId" TEXT NOT NULL,
    "fechaCierre" DATE NOT NULL,
    "montoEsperado" DECIMAL(12,2) NOT NULL,
    "montoReportado" DECIMAL(12,2) NOT NULL,
    "diferencia" DECIMAL(12,2) NOT NULL,
    "urlComprobanteFoto" TEXT NOT NULL,
    "notas" TEXT,
    "estado" "EstadoCierreFinanciero" NOT NULL DEFAULT 'PENDIENTE_REVISION',
    "motivoRechazo" TEXT,
    "revisadoPor" TEXT,
    "revisadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cierres_financieros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cierres_financieros_pedidos" (
    "cierreId" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "cierres_financieros_pedidos_pkey" PRIMARY KEY ("cierreId","pedidoId")
);

-- CreateTable
CREATE TABLE "registros_auditoria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "accion" TEXT NOT NULL,
    "tipoEntidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "metadatos" JSONB,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cierres_financieros_fechaCierre_estado_idx" ON "cierres_financieros"("fechaCierre", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "cierres_financieros_repartidorId_fechaCierre_key" ON "cierres_financieros"("repartidorId", "fechaCierre");

-- CreateIndex
CREATE INDEX "registros_auditoria_tipoEntidad_entidadId_idx" ON "registros_auditoria"("tipoEntidad", "entidadId");

-- CreateIndex
CREATE INDEX "registros_auditoria_usuarioId_creadoEn_idx" ON "registros_auditoria"("usuarioId", "creadoEn");

-- AddForeignKey
ALTER TABLE "cierres_financieros" ADD CONSTRAINT "cierres_financieros_repartidorId_fkey" FOREIGN KEY ("repartidorId") REFERENCES "perfiles_repartidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cierres_financieros_pedidos" ADD CONSTRAINT "cierres_financieros_pedidos_cierreId_fkey" FOREIGN KEY ("cierreId") REFERENCES "cierres_financieros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cierres_financieros_pedidos" ADD CONSTRAINT "cierres_financieros_pedidos_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_auditoria" ADD CONSTRAINT "registros_auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
