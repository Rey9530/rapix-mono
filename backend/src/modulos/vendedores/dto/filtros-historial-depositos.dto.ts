import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';

export class FiltrosHistorialDepositosDto extends PaginacionDto {
  @ApiPropertyOptional({ description: 'YYYY-MM-DD o ISO 8601' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD o ISO 8601' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
