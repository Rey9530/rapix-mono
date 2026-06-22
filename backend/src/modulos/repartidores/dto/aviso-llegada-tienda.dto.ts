import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class AvisoLlegadaTiendaDto {
  @ApiProperty({ example: 'f4b7e3a1-2c4d-4e6f-8a9b-1c2d3e4f5a6b' })
  @IsUUID('4')
  pedidoId!: string;

  @ApiProperty({ required: false, example: 13.6929 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitud?: number;

  @ApiProperty({ required: false, example: -89.2182 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitud?: number;

  @ApiProperty({ required: false, example: 'Estoy en la entrada del local' })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  notas?: string;
}
