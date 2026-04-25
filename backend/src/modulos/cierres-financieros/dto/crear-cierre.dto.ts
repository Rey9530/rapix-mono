import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CrearCierreDto {
  @ApiProperty({ description: 'Monto reportado por el repartidor (USD)', example: 100 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoReportado!: number;

  @ApiPropertyOptional({ description: 'Notas del repartidor' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notas?: string;
}
