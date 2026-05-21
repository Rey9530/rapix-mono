import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInDto {
  @ApiProperty({
    description:
      'idToken JWT obtenido por la app cliente vía Google Sign-In. El backend valida su firma con google-auth-library.',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
