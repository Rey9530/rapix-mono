import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EstadoPaquete } from '../../../generated/prisma/client.js';

export class ActualizarPaqueteAsignadoDto {
  @ApiPropertyOptional({
    description:
      'Cantidad de envíos restantes (admin puede ajustarla manualmente, p. ej. 100 → 85).',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  enviosRestantes?: number;

  @ApiPropertyOptional({ enum: EstadoPaquete })
  @IsOptional()
  @IsEnum(EstadoPaquete)
  estado?: EstadoPaquete;

  @ApiPropertyOptional({
    description: 'Fecha de expiración. Si se envía null se elimina el vencimiento.',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiraEn?: Date | null;

  @ApiPropertyOptional({ maxLength: 240 })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  notas?: string;
}
