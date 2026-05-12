import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TipoCuentaBancaria } from '../../../generated/prisma/client.js';

export class CrearCuentaBancariaDto {
  @IsUUID()
  bancoId!: string;

  @IsEnum(TipoCuentaBancaria, {
    message: 'tipoCuenta debe ser AHORRO o CORRIENTE',
  })
  tipoCuenta!: TipoCuentaBancaria;

  @IsString()
  @Matches(/^\d{8,20}$/, {
    message: 'El número de cuenta debe contener entre 8 y 20 dígitos',
  })
  numeroCuenta!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  alias?: string;

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}
