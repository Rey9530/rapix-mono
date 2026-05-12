import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TipoCuentaBancaria } from '../../../generated/prisma/client.js';

// Solo se permiten cambios en alias, tipoCuenta y esPrincipal.
// El banco y número de cuenta no son editables: el ValidationPipe global
// está configurado con forbidNonWhitelisted, por lo que cualquier intento
// de mandar bancoId o numeroCuenta devuelve 400.
export class ActualizarCuentaBancariaDto {
  @IsOptional()
  @IsEnum(TipoCuentaBancaria, {
    message: 'tipoCuenta debe ser AHORRO o CORRIENTE',
  })
  tipoCuenta?: TipoCuentaBancaria;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  alias?: string;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}
