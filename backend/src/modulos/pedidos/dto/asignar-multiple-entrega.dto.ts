import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class AsignarMultipleEntregaDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    description:
      'IDs de pedidos en estado EN_PUNTO_INTERCAMBIO a asignar al rider de entrega (mínimo 1).',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  pedidoIds!: string[];

  @ApiProperty({
    format: 'uuid',
    description: 'Repartidor que tomará la entrega (debe pertenecer a la zona de destino de cada pedido).',
  })
  @IsUUID()
  repartidorEntregaId!: string;
}
