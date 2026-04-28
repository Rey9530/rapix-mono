import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// DTO para que un VENDEDOR autenticado actualice su propio PerfilVendedor.
// Todos los campos son opcionales: solo se actualizan los enviados.
// Los valores numéricos llegan como string en multipart, por eso usamos Type(() => Number).
export class ActualizarPerfilVendedorDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombreNegocio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rfc?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(240)
  direccion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitud?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitud?: number;
}
