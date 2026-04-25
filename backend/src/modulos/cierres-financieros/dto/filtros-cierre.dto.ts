import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';
import { EstadoCierreFinanciero } from '../../../generated/prisma/client.js';

export class FiltrosCierreDto extends PaginacionDto {
  @ApiPropertyOptional({ enum: EstadoCierreFinanciero })
  @IsOptional()
  @IsEnum(EstadoCierreFinanciero)
  estado?: EstadoCierreFinanciero;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  hasta?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  repartidorId?: string;
}
