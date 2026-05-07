import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ReaccionarMensajeDto {
  /**
   * Emoji a aplicar. Cadena vacia o `null` quita la reaccion.
   */
  @IsOptional()
  @IsString()
  @MaxLength(8)
  emoji?: string | null;
}
