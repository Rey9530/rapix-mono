import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsEmail()
  email?: string;

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

  // Solo aplica a usuarios con rol ADMIN.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permisos?: string[];
}
