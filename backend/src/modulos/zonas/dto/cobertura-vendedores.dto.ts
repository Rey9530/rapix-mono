import { ApiProperty } from '@nestjs/swagger';
import type { EstadoUsuario } from '../../../generated/prisma/client.js';
import { ZonaDto } from './zona.dto.js';

export class VendedorEnCoberturaDto {
  @ApiProperty({ format: 'uuid' })
  usuarioId!: string;

  @ApiProperty({ format: 'uuid' })
  perfilVendedorId!: string;

  @ApiProperty()
  nombreCompleto!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  telefono!: string | null;

  @ApiProperty({ enumName: 'EstadoUsuario' })
  estado!: EstadoUsuario;

  @ApiProperty()
  nombreNegocio!: string;

  @ApiProperty()
  direccion!: string;

  @ApiProperty()
  latitud!: number;

  @ApiProperty()
  longitud!: number;

  @ApiProperty({ description: 'ST_Contains(zona.poligono, punto).' })
  dentroDeZona!: boolean;

  @ApiProperty({
    description: 'ST_Distance en SRID 3857 (metros) al centro de la zona.',
  })
  distanciaAlCentroMetros!: number;
}

export class PuntoIntercambioEnCoberturaDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  latitud!: number;

  @ApiProperty()
  longitud!: number;
}

export class CoberturaVendedoresDto {
  @ApiProperty({ type: ZonaDto })
  zona!: ZonaDto;

  @ApiProperty({ type: [VendedorEnCoberturaDto] })
  vendedores!: VendedorEnCoberturaDto[];

  @ApiProperty({ type: PuntoIntercambioEnCoberturaDto, nullable: true })
  puntoIntercambio!: PuntoIntercambioEnCoberturaDto | null;
}
