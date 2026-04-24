import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CrearPerfilRepartidorDto {
  @ApiProperty({ example: 'moto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  tipoVehiculo!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  placa?: string;

  @ApiProperty({ example: '01234567-8' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  documentoIdentidad!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{8,15}$/)
  telefonoEmergencia?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  zonaIds?: string[];

  @ApiProperty({ required: false, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  zonaPrimariaId?: string;
}
