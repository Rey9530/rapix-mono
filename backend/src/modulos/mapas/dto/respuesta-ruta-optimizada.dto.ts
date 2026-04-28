import { ApiProperty } from '@nestjs/swagger';

export class RespuestaRutaOptimizadaDto {
  @ApiProperty({
    description: 'Polyline codificado (precision 5) con la geometría completa de la ruta optimizada.',
    example: 'mfp_C~xshNa@}AbAcA~B}@',
  })
  geometriaPolyline!: string;

  @ApiProperty({
    description: 'Distancia total de la ruta en metros.',
    example: 4521.3,
  })
  distanciaMetros!: number;

  @ApiProperty({
    description: 'Duración estimada de la ruta en segundos.',
    example: 612.5,
  })
  duracionSegundos!: number;

  @ApiProperty({
    description:
      'Orden óptimo de los waypoints originales (índices base 0). Por ejemplo, [0, 2, 1, 3] indica que el ' +
      'segundo punto a visitar es el que en la entrada estaba en índice 2.',
    example: [0, 2, 1, 3],
    type: [Number],
  })
  ordenWaypoints!: number[];
}
