import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MetodoPago } from '../../../generated/prisma/client.js';

export class ActualizarPedidoDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120)
  nombreCliente?: string;

  @ApiProperty({
    required: false,
    example: '70001234',
    description:
      '8 dígitos, debe iniciar con 2, 6 o 7 (El Salvador). El servidor agrega el prefijo +503.',
  })
  @IsOptional() @IsString() @Matches(/^[267][0-9]{7}$/, {
    message: 'El teléfono debe tener 8 dígitos y empezar con 2, 6 o 7.',
  })
  telefonoCliente?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsEmail()
  emailCliente?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(240)
  direccionOrigen?: string;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsLatitude()
  latitudOrigen?: number;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsLongitude()
  longitudOrigen?: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(240)
  notasOrigen?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(240)
  direccionDestino?: string;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsLatitude()
  latitudDestino?: number;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsLongitude()
  longitudDestino?: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(240)
  notasDestino?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(240)
  descripcionPaquete?: string;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsPositive()
  pesoPaqueteKg?: number;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsPositive()
  valorDeclarado?: number;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsPositive()
  montoContraEntrega?: number;

  @ApiProperty({ enum: MetodoPago, required: false })
  @IsOptional() @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @ApiProperty({ required: false })
  @IsOptional() @IsDateString()
  programadoPara?: string;
}
