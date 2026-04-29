import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';
import { ModoFacturacion } from '../../../generated/prisma/client.js';

export class FiltrosReglaTarifaDto extends PaginacionDto {
  @ApiPropertyOptional({ enum: ModoFacturacion })
  @IsOptional()
  @IsEnum(ModoFacturacion)
  modoFacturacion?: ModoFacturacion;

  @ApiPropertyOptional({ description: 'true | false (filtra por estado activo)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  activa?: boolean;

  @ApiPropertyOptional({ description: 'Búsqueda por nombre (case-insensitive)' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  busqueda?: string;
}
