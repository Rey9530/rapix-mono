import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsOptional, IsUUID } from 'class-validator';

export class AsignarMultiplePedidosDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    description: 'IDs de pedidos a asignar (mínimo 1).',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  pedidoIds!: string[];

  @ApiProperty({ format: 'uuid', description: 'Repartidor de recogida.' })
  @IsUUID()
  repartidorRecogidaId!: string;

  @ApiProperty({ required: false, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  repartidorEntregaId?: string;
}
