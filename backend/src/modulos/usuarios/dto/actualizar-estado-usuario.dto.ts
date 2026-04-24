import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoUsuario } from '../../../generated/prisma/client.js';

export class ActualizarEstadoUsuarioDto {
  @IsEnum(EstadoUsuario)
  estado!: EstadoUsuario;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  motivo?: string;
}
