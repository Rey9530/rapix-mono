import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class EnviarMensajeTextoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  texto!: string;

  @IsOptional()
  @IsUUID()
  respondeAId?: string;
}
