import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class ActualizarUbicacionDto {
  @ApiProperty({ example: 13.6929 })
  @Type(() => Number)
  @IsNumber()
  @IsLatitude()
  latitud!: number;

  @ApiProperty({ example: -89.2182 })
  @Type(() => Number)
  @IsNumber()
  @IsLongitude()
  longitud!: number;
}
