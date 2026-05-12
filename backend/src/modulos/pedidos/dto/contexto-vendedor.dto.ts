import { ApiProperty } from '@nestjs/swagger';

export class ContextoVendedorDto {
  @ApiProperty({
    description:
      'true si el vendedor tiene PerfilVendedor con direccion + lat/lng. false cuando el usuario VENDEDOR aun no tiene perfil creado.',
  })
  tieneUbicacion!: boolean;

  @ApiProperty({ nullable: true, type: String })
  vendedorId!: string | null;

  @ApiProperty({ nullable: true, type: String })
  nombreNegocio!: string | null;

  @ApiProperty({ nullable: true, type: String })
  direccion!: string | null;

  @ApiProperty({ nullable: true, type: Number })
  latitud!: number | null;

  @ApiProperty({ nullable: true, type: Number })
  longitud!: number | null;

  @ApiProperty({ nullable: true, type: String })
  urlLogo!: string | null;
}
