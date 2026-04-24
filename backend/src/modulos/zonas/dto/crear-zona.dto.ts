import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PuntoGeoDto } from './punto-geo.dto.js';

export class CrearZonaDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo!: string;

  @ApiProperty({ example: 'Zona Norte' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  nombre!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  descripcion?: string;

  @ApiProperty({ type: [PuntoGeoDto], description: 'Mínimo 3 puntos. Si no está cerrado, se cierra automáticamente.' })
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => PuntoGeoDto)
  poligono!: PuntoGeoDto[];

  @ApiProperty({ example: 13.6929 })
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitudCentro!: number;

  @ApiProperty({ example: -89.2182 })
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitudCentro!: number;

  @ApiProperty({ required: false, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  puntoIntercambioId?: string;
}
