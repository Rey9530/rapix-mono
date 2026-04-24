import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoUsuario, RolUsuario } from '../../../generated/prisma/client.js';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';

export class ListarUsuariosDto extends PaginacionDto {
  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;

  @IsOptional()
  @IsEnum(EstadoUsuario)
  estado?: EstadoUsuario;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  busqueda?: string;
}
