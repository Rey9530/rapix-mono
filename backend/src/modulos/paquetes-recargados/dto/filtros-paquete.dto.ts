import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';
import { EstadoPaquete } from '../../../generated/prisma/client.js';

export class FiltrosPaqueteDto extends PaginacionDto {
  @ApiPropertyOptional({ enum: EstadoPaquete })
  @IsOptional()
  @IsEnum(EstadoPaquete)
  estado?: EstadoPaquete;

  @ApiPropertyOptional({ description: 'Solo aplica para listado admin global' })
  @IsOptional()
  @IsUUID()
  vendedorId?: string;
}
