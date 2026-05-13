import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';

export class FiltrosDepositosAdminDto extends PaginacionDto {
  @ApiPropertyOptional({ description: 'Filtrar por ID del PerfilVendedor' })
  @IsOptional()
  @IsUUID()
  vendedorId?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD o ISO 8601' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD o ISO 8601' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
