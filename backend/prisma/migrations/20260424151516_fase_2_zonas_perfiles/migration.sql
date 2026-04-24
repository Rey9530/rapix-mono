-- CreateTable
CREATE TABLE "perfiles_vendedor" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombreNegocio" TEXT NOT NULL,
    "rfc" TEXT,
    "direccion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "urlLogo" TEXT,
    "saldoRecargado" INTEGER NOT NULL DEFAULT 0,
    "limiteCredito" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_repartidor" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipoVehiculo" TEXT NOT NULL,
    "placa" TEXT,
    "documentoIdentidad" TEXT NOT NULL,
    "telefonoEmergencia" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "latitudActual" DOUBLE PRECISION,
    "longitudActual" DOUBLE PRECISION,
    "ultimaUbicacionEn" TIMESTAMP(3),
    "calificacion" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalEntregas" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_repartidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puntos_intercambio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "puntos_intercambio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "poligono" geometry(Polygon, 4326),
    "latitudCentro" DOUBLE PRECISION NOT NULL,
    "longitudCentro" DOUBLE PRECISION NOT NULL,
    "puntoIntercambioId" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas_repartidor" (
    "repartidorId" TEXT NOT NULL,
    "zonaId" TEXT NOT NULL,
    "esPrimaria" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zonas_repartidor_pkey" PRIMARY KEY ("repartidorId","zonaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_vendedor_usuarioId_key" ON "perfiles_vendedor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_repartidor_usuarioId_key" ON "perfiles_repartidor"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "zonas_codigo_key" ON "zonas"("codigo");

-- CreateIndex
CREATE INDEX "zonas_activa_idx" ON "zonas"("activa");

-- CreateIndex (manual) — índice GIST para ST_Contains sobre poligono (Tarea 2.0)
CREATE INDEX "zonas_poligono_gist" ON "zonas" USING GIST ("poligono");

-- AddForeignKey
ALTER TABLE "perfiles_vendedor" ADD CONSTRAINT "perfiles_vendedor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_repartidor" ADD CONSTRAINT "perfiles_repartidor_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas" ADD CONSTRAINT "zonas_puntoIntercambioId_fkey" FOREIGN KEY ("puntoIntercambioId") REFERENCES "puntos_intercambio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas_repartidor" ADD CONSTRAINT "zonas_repartidor_repartidorId_fkey" FOREIGN KEY ("repartidorId") REFERENCES "perfiles_repartidor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas_repartidor" ADD CONSTRAINT "zonas_repartidor_zonaId_fkey" FOREIGN KEY ("zonaId") REFERENCES "zonas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
