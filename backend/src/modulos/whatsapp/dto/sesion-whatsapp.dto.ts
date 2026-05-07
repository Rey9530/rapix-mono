import { ApiProperty } from '@nestjs/swagger';
import type { EstadoSesionWhatsapp } from '../../../generated/prisma/client.js';

export class SesionWhatsappDto {
  @ApiProperty({
    enum: ['DESCONECTADA', 'ESPERANDO_QR', 'CONECTADA', 'EXPIRADA', 'BANEADA'],
  })
  estado!: EstadoSesionWhatsapp;

  @ApiProperty({ required: false, nullable: true })
  jidPropio!: string | null;

  @ApiProperty({ required: false, nullable: true })
  numeroPropio!: string | null;

  @ApiProperty({ required: false, nullable: true })
  nombrePropio!: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'String crudo del QR vigente (o null si no aplica).',
  })
  qrActual!: string | null;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date-time' })
  qrExpiraEn!: string | null;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date-time' })
  conectadoEn!: string | null;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date-time' })
  desconectadoEn!: string | null;

  @ApiProperty({ required: false, nullable: true })
  ultimoError!: string | null;
}
