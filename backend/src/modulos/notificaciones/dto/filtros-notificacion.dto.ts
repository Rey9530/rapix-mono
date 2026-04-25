import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional } from 'class-validator';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';
import {
  CanalNotificacion,
  EstadoNotificacion,
} from '../../../generated/prisma/client.js';

export class FiltrosNotificacionDto extends PaginacionDto {
  @ApiPropertyOptional({ enum: EstadoNotificacion })
  @IsOptional()
  @IsEnum(EstadoNotificacion)
  estado?: EstadoNotificacion;

  @ApiPropertyOptional({ enum: CanalNotificacion })
  @IsOptional()
  @IsEnum(CanalNotificacion)
  canal?: CanalNotificacion;

  @ApiPropertyOptional({ description: 'Filtrar solo no leídas (true/false)' })
  @IsOptional()
  @IsBooleanString()
  soloNoLeidas?: string;
}
