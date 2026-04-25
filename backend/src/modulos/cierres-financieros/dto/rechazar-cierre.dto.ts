import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RechazarCierreDto {
  @ApiProperty({ description: 'Motivo del rechazo (obligatorio)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motivo!: string;
}
