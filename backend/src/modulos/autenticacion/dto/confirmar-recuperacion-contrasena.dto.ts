import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { EsContrasenaFuerte } from '../../../comun/validadores/es-contrasena-fuerte.decorador.js';

export class ConfirmarRecuperacionContrasenaDto {
  @ApiProperty({ example: 'usuario@correo.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de 6 dígitos enviado por correo.',
  })
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'El código debe tener 6 dígitos' })
  codigo!: string;

  @ApiProperty({
    example: 'NuevaClav3!',
    description: '8-64 caracteres. Debe incluir mayúscula, número y símbolo.',
  })
  @IsString()
  @EsContrasenaFuerte()
  nuevaContrasena!: string;
}
