import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ActualizarVersionAppDto {
  @ApiProperty({
    description: 'Versión mínima requerida en formato semver (x.y.z)',
    example: '1.0.2',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'versionMinima debe tener formato x.y.z (ej. 1.0.2)',
  })
  versionMinima!: string;
}
