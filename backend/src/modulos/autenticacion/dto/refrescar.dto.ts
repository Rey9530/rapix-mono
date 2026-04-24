import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefrescarDto {
  @ApiProperty({
    description: 'Token de refresco emitido en el último iniciar-sesion o refrescar',
  })
  @IsJWT()
  @IsNotEmpty()
  tokenRefresco!: string;
}
