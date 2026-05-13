import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CrearDepositoVendedorDto {
  @ApiProperty({ description: 'ID del PerfilVendedor receptor del depósito' })
  @IsUUID()
  vendedorId!: string;

  @ApiProperty({
    description:
      'IDs de los pedidos CONTRA_ENTREGA + ENTREGADO + sin depositar que se incluyen',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  @Transform(({ value }) => {
    // En multipart/form-data, cuando se hace form.append('pedidoIds', id) varias
    // veces el servidor lo recibe como array; pero algunos clientes mandan un
    // único string separado por comas. Toleramos ambos.
    if (Array.isArray(value)) return value;
    if (typeof value === 'string')
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    return value;
  })
  pedidoIds!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cuentaBancariaId?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 (default: ahora)' })
  @IsOptional()
  @IsDateString()
  fechaDeposito?: string;

  @ApiPropertyOptional({ description: 'Número de referencia/SPEI' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referencia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notas?: string;
}
