import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FiltrosChatsDto {
  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @IsEnum(['INDIVIDUAL', 'GRUPO'])
  tipo?: 'INDIVIDUAL' | 'GRUPO';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number = 30;
}
