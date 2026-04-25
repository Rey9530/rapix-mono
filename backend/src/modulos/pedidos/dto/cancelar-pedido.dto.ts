import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelarPedidoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(240)
  motivo?: string;
}
