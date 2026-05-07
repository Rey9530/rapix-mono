import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FiltrosMensajesDto {
  /**
   * ISO date — devuelve mensajes con `creadoEn < antesDe`. Para paginar hacia atras,
   * se pasa la fecha del mensaje mas antiguo de la pagina anterior.
   */
  @IsOptional()
  @IsDateString()
  antesDe?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limite?: number = 50;
}
