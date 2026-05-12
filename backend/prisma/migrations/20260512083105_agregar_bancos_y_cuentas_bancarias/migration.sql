-- CreateEnum
CREATE TYPE "TipoCuentaBancaria" AS ENUM ('AHORRO', 'CORRIENTE');

-- CreateTable
CREATE TABLE "bancos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas_bancarias" (
    "id" TEXT NOT NULL,
    "perfil_vendedor_id" TEXT NOT NULL,
    "banco_id" TEXT NOT NULL,
    "tipo_cuenta" "TipoCuentaBancaria" NOT NULL,
    "numero_cuenta" TEXT NOT NULL,
    "alias" TEXT,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_bancarias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bancos_codigo_key" ON "bancos"("codigo");

-- CreateIndex
CREATE INDEX "bancos_activo_nombre_idx" ON "bancos"("activo", "nombre");

-- CreateIndex
CREATE INDEX "cuentas_bancarias_perfil_vendedor_id_activa_idx" ON "cuentas_bancarias"("perfil_vendedor_id", "activa");

-- AddForeignKey
ALTER TABLE "cuentas_bancarias" ADD CONSTRAINT "cuentas_bancarias_perfil_vendedor_id_fkey" FOREIGN KEY ("perfil_vendedor_id") REFERENCES "perfiles_vendedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuentas_bancarias" ADD CONSTRAINT "cuentas_bancarias_banco_id_fkey" FOREIGN KEY ("banco_id") REFERENCES "bancos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
