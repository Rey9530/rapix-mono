import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class ActualizarPedidoDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(120)
  nombreCliente?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @Matches(/^\+?[0-9]{8,15}$/)
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

  @ApiProperty({ required: false })
  @IsOptional() @IsDateString()
  programadoPara?: string;
}
