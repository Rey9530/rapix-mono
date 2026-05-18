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

  @ApiProperty({
    example: '70001234',
    description:
      '8 dígitos, debe iniciar con 2, 6 o 7 (El Salvador). El servidor agrega el prefijo +503.',
  })
  @IsString()
  @Matches(/^[267][0-9]{7}$/, {
    message: 'El teléfono debe tener 8 dígitos y empezar con 2, 6 o 7.',
  })
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
    required: false,
    example: 'https://maps.app.goo.gl/r2UeA6ByeVdYvfH89',
    description:
      'URL corta de Google Maps del destino. Opcional: si viene se expande para extraer lat/lng. Alternativamente se pueden enviar latitudDestino/longitudDestino directos.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9_-]+\/?$/, {
    message: 'urlMapasDestino debe ser una URL corta de Google Maps (maps.app.goo.gl)',
  })
  urlMapasDestino?: string;

  @ApiProperty({
    required: false,
    description:
      'Latitud del destino (opcional). Tiene prioridad sobre urlMapasDestino. Si no viene ni esta ni la URL, el pedido se crea sin coordenadas y zonaDestino queda en null.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitudDestino?: number;

  @ApiProperty({
    required: false,
    description: 'Longitud del destino (opcional). Tiene prioridad sobre urlMapasDestino.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitudDestino?: number;

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

  @ApiProperty({ description: 'Fecha de entrega programada (ISO 8601). Obligatorio.' })
  @IsDateString()
  @IsNotEmpty()
  programadoPara!: string;
}
