import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class CerrarSesionDto {
  @ApiProperty({ description: 'Token de refresco a revocar' })
  @IsJWT()
  @IsNotEmpty()
  tokenRefresco!: string;
}
