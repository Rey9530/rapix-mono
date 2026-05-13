import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Esquema validado para la salida JSON estricta de OpenAI.
 * Si el modelo devuelve algo que no encaje aqui, el clasificador degrada a
 * AMBIGUO con respuesta de fallback (manejado en `ia-clasificador.servicio.ts`).
 */
export class ClasificacionIaDto {
  @IsIn(['CONFIRMA', 'RECHAZA', 'CONDICIONAL', 'AMBIGUO'])
  intencion!: 'CONFIRMA' | 'RECHAZA' | 'CONDICIONAL' | 'AMBIGUO';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notaRider!: string | null;

  @IsString()
  @MaxLength(600)
  respuestaCliente!: string;

  @IsBoolean()
  repregunta!: boolean;
}
