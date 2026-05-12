import { ApiProperty } from '@nestjs/swagger';
import type {
  Banco,
  CuentaBancaria,
  TipoCuentaBancaria,
} from '../../../generated/prisma/client.js';
import { BancoDto } from './banco.dto.js';

// Enmascara un número de cuenta dejando los últimos 4 dígitos visibles.
// Para números muy cortos devuelve solo asteriscos.
export function enmascararNumeroCuenta(numero: string): string {
  if (!numero) return '';
  if (numero.length <= 4) return '*'.repeat(numero.length);
  return `****${numero.slice(-4)}`;
}

export class CuentaBancariaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: BancoDto })
  banco!: BancoDto;

  @ApiProperty({ enum: ['AHORRO', 'CORRIENTE'] })
  tipoCuenta!: TipoCuentaBancaria;

  @ApiProperty({ description: 'Número de cuenta (enmascarado si no es el dueño)' })
  numeroCuenta!: string;

  @ApiProperty({ nullable: true })
  alias!: string | null;

  @ApiProperty()
  esPrincipal!: boolean;

  @ApiProperty({ type: Date })
  creadoEn!: Date;

  @ApiProperty({ type: Date })
  actualizadoEn!: Date;

  static desde(
    cuenta: CuentaBancaria & { banco: Banco },
    opciones: { enmascarar: boolean } = { enmascarar: true },
  ): CuentaBancariaDto {
    const dto = new CuentaBancariaDto();
    dto.id = cuenta.id;
    dto.banco = BancoDto.desde(cuenta.banco);
    dto.tipoCuenta = cuenta.tipoCuenta;
    dto.numeroCuenta = opciones.enmascarar
      ? enmascararNumeroCuenta(cuenta.numeroCuenta)
      : cuenta.numeroCuenta;
    dto.alias = cuenta.alias;
    dto.esPrincipal = cuenta.esPrincipal;
    dto.creadoEn = cuenta.creadoEn;
    dto.actualizadoEn = cuenta.actualizadoEn;
    return dto;
  }
}
