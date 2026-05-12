-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "correoVerificadoEn" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tokens_verificacion_correo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "usadoEn" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_verificacion_correo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_correo_tokenHash_key" ON "tokens_verificacion_correo"("tokenHash");

-- CreateIndex
CREATE INDEX "tokens_verificacion_correo_usuarioId_idx" ON "tokens_verificacion_correo"("usuarioId");

-- AddForeignKey
ALTER TABLE "tokens_verificacion_correo" ADD CONSTRAINT "tokens_verificacion_correo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
