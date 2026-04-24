import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ActualizarDisponibilidadDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  disponible!: boolean;
}
