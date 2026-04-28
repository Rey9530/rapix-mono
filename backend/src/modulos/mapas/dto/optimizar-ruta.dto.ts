import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class PuntoRutaDto {
  @ApiProperty({ example: 13.6929 })
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitud!: number;

  @ApiProperty({ example: -89.2182 })
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitud!: number;
}

export class OptimizarRutaDto {
  @ApiProperty({
    type: [PuntoRutaDto],
    description:
      'Lista de puntos en orden inicial. Mapbox Optimization API soporta entre 2 y 12 waypoints. ' +
      'El primero se trata como origen y el último como destino.',
    minItems: 2,
    maxItems: 12,
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => PuntoRutaDto)
  puntos!: PuntoRutaDto[];
}
