import { ApiProperty } from '@nestjs/swagger';
import { PuntoGeoDto } from './punto-geo.dto.js';

export class ZonaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  codigo!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty({ nullable: true })
  descripcion!: string | null;

  @ApiProperty({ type: [PuntoGeoDto], description: 'Vértices del polígono en orden.' })
  poligono!: PuntoGeoDto[];

  @ApiProperty()
  latitudCentro!: number;

  @ApiProperty()
  longitudCentro!: number;

  @ApiProperty({ nullable: true, format: 'uuid' })
  puntoIntercambioId!: string | null;

  @ApiProperty()
  activa!: boolean;

  @ApiProperty({ type: Date })
  creadoEn!: Date;

  @ApiProperty({ type: Date })
  actualizadoEn!: Date;
}
