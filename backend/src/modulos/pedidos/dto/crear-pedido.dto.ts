import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { MetodoPago } from '../../../generated/prisma/client.js';

export class CrearPedidoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombreCliente!: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/)
  telefonoCliente!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  emailCliente?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(240)
  direccionOrigen!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitudOrigen!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitudOrigen!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  notasOrigen?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(240)
  direccionDestino!: string;

  @ApiProperty({
    example: 'https://maps.app.goo.gl/r2UeA6ByeVdYvfH89',
    description: 'URL corta de Google Maps del destino. El backend la expande y extrae lat/lng.',
  })
  @IsString()
  @Matches(/^https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9_-]+\/?$/, {
    message: 'urlMapasDestino debe ser una URL corta de Google Maps (maps.app.goo.gl)',
  })
  urlMapasDestino!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  notasDestino?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  descripcionPaquete?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pesoPaqueteKg?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  valorDeclarado?: number;

  @ApiProperty({ enum: MetodoPago })
  @IsEnum(MetodoPago)
  metodoPago!: MetodoPago;

  @ApiProperty({ required: false, description: 'Requerido si metodoPago=CONTRA_ENTREGA' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  montoContraEntrega?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  programadoPara?: string;
}
