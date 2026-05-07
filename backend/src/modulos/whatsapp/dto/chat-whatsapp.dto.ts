import { ApiProperty } from '@nestjs/swagger';
import type {
  TipoChatWhatsapp,
} from '../../../generated/prisma/client.js';

export class ChatWhatsappDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  jid!: string;

  @ApiProperty({ enum: ['INDIVIDUAL', 'GRUPO'] })
  tipo!: TipoChatWhatsapp;

  @ApiProperty({ required: false, nullable: true })
  nombre!: string | null;

  @ApiProperty({ required: false, nullable: true })
  numero!: string | null;

  @ApiProperty({ required: false, nullable: true })
  urlAvatar!: string | null;

  @ApiProperty({ required: false, nullable: true })
  ultimoMensajeEn!: string | null;

  @ApiProperty()
  noLeidos!: number;

  @ApiProperty()
  archivado!: boolean;
}
