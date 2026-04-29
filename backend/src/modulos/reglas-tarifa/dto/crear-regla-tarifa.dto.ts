import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ModoFacturacion } from '../../../generated/prisma/client.js';

export class CrearReglaTarifaDto {
  @ApiProperty({ example: 'Envío estándar' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  nombre!: string;

  @ApiProperty({ enum: ModoFacturacion, example: ModoFacturacion.POR_ENVIO })
  @IsEnum(ModoFacturacion)
  modoFacturacion!: ModoFacturacion;

  @ApiPropertyOptional({
    description: 'Requerido si modoFacturacion = POR_ENVIO',
    example: 2.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPorEnvio?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de envíos del paquete. Requerido si modoFacturacion = PAQUETE',
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tamanoPaquete?: number;

  @ApiPropertyOptional({
    description: 'Precio total del paquete. Requerido si modoFacturacion = PAQUETE',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPaquete?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @ApiPropertyOptional({ description: 'ISO 8601' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validaDesde?: Date;

  @ApiPropertyOptional({ description: 'ISO 8601, nullable' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validaHasta?: Date;
}
