import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoPaquete } from '../../../generated/prisma/client.js';

export class ActualizarPaqueteDto {
  @ApiProperty({
    enum: EstadoPaquete,
    description:
      'Nuevo estado del paquete. Transiciones permitidas: PENDIENTE_PAGO→ACTIVO, PENDIENTE_PAGO→CANCELADO, ACTIVO→CANCELADO.',
  })
  @IsEnum(EstadoPaquete)
  estado!: EstadoPaquete;
}
