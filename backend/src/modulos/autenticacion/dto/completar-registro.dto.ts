import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CompletarRegistroDto {
  @ApiProperty({
    example: '70001234',
    description:
      '8 digitos, debe iniciar con 2, 6 o 7 (El Salvador). El servidor agrega el prefijo +503.',
  })
  @IsString()
  @Matches(/^[267][0-9]{7}$/, {
    message: 'El telefono debe tener 8 digitos y empezar con 2, 6 o 7.',
  })
  telefono!: string;

  @ApiProperty({ example: 'Tienda Uno' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  nombreNegocio!: string;

  @ApiProperty({ example: 'Av. Insurgentes 247' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  direccion!: string;

  @ApiProperty({ example: 13.6929 })
  @IsNumber()
  latitud!: number;

  @ApiProperty({ example: -89.2182 })
  @IsNumber()
  longitud!: number;
}
