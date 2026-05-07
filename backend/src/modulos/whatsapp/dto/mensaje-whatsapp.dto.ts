import { ApiProperty } from '@nestjs/swagger';
import type {
  DireccionMensajeWhatsapp,
  EstadoMensajeWhatsapp,
  TipoMensajeWhatsapp,
} from '../../../generated/prisma/client.js';

export class MensajeWhatsappDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  externoId!: string;

  @ApiProperty()
  chatId!: string;

  @ApiProperty({ required: false, nullable: true })
  remitenteId!: string | null;

  @ApiProperty({ enum: ['ENTRANTE', 'SALIENTE'] })
  direccion!: DireccionMensajeWhatsapp;

  @ApiProperty({
    enum: [
      'TEXTO',
      'IMAGEN',
      'VIDEO',
      'AUDIO',
      'DOCUMENTO',
      'STICKER',
      'UBICACION',
      'CONTACTO',
      'SISTEMA',
    ],
  })
  tipo!: TipoMensajeWhatsapp;

  @ApiProperty({
    enum: ['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'LEIDO', 'FALLIDO'],
  })
  estado!: EstadoMensajeWhatsapp;

  @ApiProperty({ required: false, nullable: true })
  texto!: string | null;

  @ApiProperty({ required: false, nullable: true })
  caption!: string | null;

  @ApiProperty({ required: false, nullable: true })
  urlMedia!: string | null;

  @ApiProperty({ required: false, nullable: true })
  mimeMedia!: string | null;

  @ApiProperty({ required: false, nullable: true })
  bytesMedia!: number | null;

  @ApiProperty({ required: false, nullable: true })
  duracionSeg!: number | null;

  @ApiProperty({ required: false, nullable: true })
  nombreArchivo!: string | null;

  @ApiProperty({ required: false, nullable: true })
  enviadoEn!: string | null;

  @ApiProperty({ required: false, nullable: true })
  entregadoEn!: string | null;

  @ApiProperty({ required: false, nullable: true })
  leidoEn!: string | null;

  @ApiProperty()
  creadoEn!: string;
}
