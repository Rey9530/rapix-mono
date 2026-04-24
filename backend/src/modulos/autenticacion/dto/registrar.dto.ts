import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EsContrasenaFuerte } from '../../../comun/validadores/es-contrasena-fuerte.decorador.js';

// Solo VENDEDOR y CLIENTE pueden registrarse por el endpoint público.
// ADMIN y REPARTIDOR los crea un admin (Tarea 1.6).
export enum RolRegistrable {
  VENDEDOR = 'VENDEDOR',
  CLIENTE = 'CLIENTE',
}

export class RegistrarDto {
  @ApiProperty({ example: 'tienda@delivery.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '+50370001234',
    description: '8-15 dígitos, opcionalmente con prefijo +.',
  })
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/, {
    message: 'El teléfono debe tener 8-15 dígitos, opcionalmente con prefijo +.',
  })
  telefono!: string;

  @ApiProperty({
    example: 'Secret123!',
    description: '8-64 caracteres. Debe incluir mayúscula, número y símbolo.',
  })
  @IsString()
  @EsContrasenaFuerte()
  contrasena!: string;

  @ApiProperty({ example: 'Tienda Uno' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  nombreCompleto!: string;

  @ApiProperty({ enum: RolRegistrable, example: RolRegistrable.VENDEDOR })
  @IsEnum(RolRegistrable)
  rol!: RolRegistrable;

  // Campos opcionales de PerfilVendedor (se persistirán cuando la Tarea 2.1
  // añada el modelo; aceptados hoy para no romper el contrato del cliente).
  @ApiProperty({ required: false, example: 'Tienda Uno' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nombreNegocio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  direccion?: string;

  @ApiProperty({ required: false, example: 13.6929 })
  @IsOptional()
  latitud?: number;

  @ApiProperty({ required: false, example: -89.2182 })
  @IsOptional()
  longitud?: number;
}
