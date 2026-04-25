import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class ConsumoPaquetesDto {
  @ApiProperty({ description: 'Fecha desde (ISO 8601)', example: '2026-01-01' })
  @IsDateString()
  desde!: string;

  @ApiProperty({ description: 'Fecha hasta (ISO 8601)', example: '2026-12-31' })
  @IsDateString()
  hasta!: string;

  @ApiPropertyOptional({ description: 'Filtrar por un único vendedor' })
  @IsOptional()
  @IsUUID()
  vendedorId?: string;
}
