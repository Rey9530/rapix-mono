-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "registroCompleto" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "hashContrasena" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_googleId_key" ON "usuarios"("googleId");

-- Backfill: usuarios pre-existentes ya tenian telefono y hashContrasena
-- obligatorios (antes de esta migracion eran NOT NULL), por lo que su
-- registro debe considerarse completo. La condicion es defensiva.
UPDATE "usuarios"
SET "registroCompleto" = TRUE
WHERE "hashContrasena" IS NOT NULL AND "telefono" IS NOT NULL;
