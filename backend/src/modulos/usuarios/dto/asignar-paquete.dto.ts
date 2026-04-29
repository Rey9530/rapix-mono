import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class AsignarPaqueteDto {
  @ApiProperty({
    format: 'uuid',
    description: 'ID de la regla de tarifa con modoFacturacion = PAQUETE',
  })
  @IsUUID()
  reglaTarifaId!: string;

  @ApiPropertyOptional({
    description:
      'Cantidad total de envíos del paquete asignado. Si se omite, se usa el tamaño definido en la regla.',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  enviosTotales?: number;

  @ApiPropertyOptional({
    description:
      'Cantidad de envíos restantes al asignar (≤ enviosTotales). Útil cuando el admin registra un paquete ya consumido en parte. Si se omite, se iguala a enviosTotales.',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  enviosRestantes?: number;

  @ApiPropertyOptional({
    description:
      'Precio cobrado al vendedor. Si se omite, se usa el precio configurado en la regla.',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio?: number;

  @ApiPropertyOptional({ description: 'Fecha de expiración (ISO 8601). Vacío = sin vencimiento.' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiraEn?: Date;

  @ApiPropertyOptional({
    description: 'Nota libre que se guarda en auditoría.',
    maxLength: 240,
  })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  notas?: string;
}
