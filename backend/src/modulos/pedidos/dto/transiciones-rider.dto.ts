import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/** Mixin: lat/lng/notas opcionales que comparten todas las transiciones del rider. */
export class TransicionBaseDto {
  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsLatitude()
  latitud?: number;

  @ApiProperty({ required: false })
  @IsOptional() @Type(() => Number) @IsNumber() @IsLongitude()
  longitud?: number;

  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(240)
  notas?: string;
}

export class RecogerPedidoDto extends TransicionBaseDto {}
export class EnTransitoPedidoDto extends TransicionBaseDto {}
export class LlegarIntercambioPedidoDto extends TransicionBaseDto {}
export class TomarEntregaPedidoDto extends TransicionBaseDto {}
export class ReintentarPedidoDto extends TransicionBaseDto {}
export class DevolverPedidoDto extends TransicionBaseDto {}

export class EntregarPedidoDto extends TransicionBaseDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString() @MaxLength(120)
  recibidoPor?: string;
}

export class FallarPedidoDto extends TransicionBaseDto {
  @ApiProperty()
  @IsString() @MaxLength(240)
  motivo!: string;
}
