import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ActualizarPerfilPropioDto {
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombreCompleto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  urlAvatar?: string;
}
