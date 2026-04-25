import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { MetodoPago } from '../../../generated/prisma/client.js';

export class ComprarPaqueteDto {
  @ApiProperty({ description: 'ID de la regla de tarifa con modoFacturacion=PAQUETE' })
  @IsUUID()
  reglaTarifaId!: string;

  @ApiProperty({ enum: MetodoPago, description: 'Método de pago de la compra' })
  @IsEnum(MetodoPago)
  metodoPago!: MetodoPago;

  @ApiPropertyOptional({
    description: 'Días desde hoy hasta la expiración del paquete (opcional)',
    minimum: 1,
    maximum: 730,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(730)
  diasExpiracion?: number;
}
