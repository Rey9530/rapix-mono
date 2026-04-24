import {
  IsArray,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RolUsuario } from '../../../generated/prisma/client.js';
import { EsContrasenaFuerte } from '../../../comun/validadores/es-contrasena-fuerte.decorador.js';

export class CrearUsuarioDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, {
    message: 'El teléfono debe tener 8-15 dígitos, opcionalmente con prefijo +.',
  })
  telefono!: string;

  @IsString()
  @EsContrasenaFuerte()
  contrasena!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  nombreCompleto!: string;

  @IsEnum(RolUsuario)
  rol!: RolUsuario;

  // ADMIN — se persiste en PerfilAdmin.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permisos?: string[];

  // VENDEDOR — se persistirá cuando la Tarea 2.1 añada PerfilVendedor.
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nombreNegocio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  direccion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitud?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitud?: number;

  // REPARTIDOR — se persistirá cuando la Tarea 2.4 añada PerfilRepartidor.
  @IsOptional()
  @IsString()
  @MaxLength(40)
  tipoVehiculo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  placa?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  documentoIdentidad?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/)
  telefonoEmergencia?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  zonaIds?: string[];

  @IsOptional()
  @IsString()
  zonaPrimariaId?: string;
}
