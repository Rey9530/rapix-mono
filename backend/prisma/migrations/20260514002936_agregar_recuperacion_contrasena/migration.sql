-- CreateTable
CREATE TABLE "tokens_recuperacion_contrasena" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "usadoEn" TIMESTAMP(3),
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_recuperacion_contrasena_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_recuperacion_contrasena_tokenHash_key" ON "tokens_recuperacion_contrasena"("tokenHash");

-- CreateIndex
CREATE INDEX "tokens_recuperacion_contrasena_usuarioId_idx" ON "tokens_recuperacion_contrasena"("usuarioId");

-- AddForeignKey
ALTER TABLE "tokens_recuperacion_contrasena" ADD CONSTRAINT "tokens_recuperacion_contrasena_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
