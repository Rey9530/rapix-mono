import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { PlataformaDispositivo } from '../../../generated/prisma/client.js';

export class RegistrarTokenDispositivoDto {
  @ApiProperty({ description: 'Token FCM emitido por la app móvil/web' })
  @IsString()
  @MinLength(10)
  token!: string;

  @ApiProperty({ enum: PlataformaDispositivo })
  @IsEnum(PlataformaDispositivo)
  plataforma!: PlataformaDispositivo;
}
