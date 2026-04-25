import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { EstadoPedido } from '../../../generated/prisma/client.js';
import { PaginacionDto } from '../../../comun/dto/paginacion.dto.js';

export class FiltrosPedidoDto extends PaginacionDto {
  @IsOptional() @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional() @IsUUID()
  zonaId?: string;

  @IsOptional() @IsUUID()
  vendedorId?: string;

  @IsOptional() @IsUUID()
  repartidorId?: string;

  @IsOptional() @IsDateString()
  desde?: string;

  @IsOptional() @IsDateString()
  hasta?: string;

  @IsOptional() @IsString() @MaxLength(120)
  busqueda?: string;
}
