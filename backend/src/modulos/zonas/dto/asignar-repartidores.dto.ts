import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsUUID } from 'class-validator';

export class AsignarRepartidoresAZonaDto {
  @ApiProperty({
    type: [String],
    description: 'IDs de PerfilRepartidor a asignar a la zona.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  repartidorIds!: string[];

  @ApiProperty({
    required: false,
    format: 'uuid',
    description:
      'Si se proporciona, ese repartidor queda como primario; los demás de la zona pierden esPrimaria.',
  })
  @IsOptional()
  @IsUUID()
  repartidorPrimarioId?: string;
}
