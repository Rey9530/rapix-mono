import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class PuntoGeoDto {
  @ApiProperty({ example: 13.6929, description: 'Latitud WGS84 (-90..90)' })
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  lat!: number;

  @ApiProperty({ example: -89.2182, description: 'Longitud WGS84 (-180..180)' })
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  lng!: number;
}
