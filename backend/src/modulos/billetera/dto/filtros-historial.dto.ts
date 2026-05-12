import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';
import { TipoMovimientoCaja } from '../../../generated/prisma/client.js';

export class FiltrosHistorialDto extends PaginacionDto {
  @ApiPropertyOptional({ enum: TipoMovimientoCaja })
  @IsOptional()
  @IsEnum(TipoMovimientoCaja)
  tipo?: TipoMovimientoCaja;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
