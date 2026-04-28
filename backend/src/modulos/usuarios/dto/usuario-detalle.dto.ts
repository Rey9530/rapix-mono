import { ApiProperty } from '@nestjs/swagger';
import type {
  PerfilAdmin,
  PerfilRepartidor,
  PerfilVendedor,
  Usuario,
  Zona,
  ZonaRepartidor,
} from '../../../generated/prisma/client.js';
import { UsuarioPublicoDto } from '../../autenticacion/dto/usuario-publico.dto.js';

export class PerfilAdminDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: [String] })
  permisos!: string[];

  static desde(p: PerfilAdmin): PerfilAdminDto {
    const dto = new PerfilAdminDto();
    dto.id = p.id;
    dto.permisos = p.permisos;
    return dto;
  }
}

export class PerfilVendedorDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  nombreNegocio!: string;

  @ApiProperty({ nullable: true })
  rfc!: string | null;

  @ApiProperty()
  direccion!: string;

  @ApiProperty()
  latitud!: number;

  @ApiProperty()
  longitud!: number;

  @ApiProperty({ nullable: true })
  urlLogo!: string | null;

  @ApiProperty()
  saldoRecargado!: number;

  @ApiProperty({ description: 'Decimal serializado como string' })
  limiteCredito!: string;

  @ApiProperty({ type: Date })
  creadoEn!: Date;

  @ApiProperty({ type: Date })
  actualizadoEn!: Date;

  static desde(p: PerfilVendedor): PerfilVendedorDto {
    const dto = new PerfilVendedorDto();
    dto.id = p.id;
    dto.nombreNegocio = p.nombreNegocio;
    dto.rfc = p.rfc;
    dto.direccion = p.direccion;
    dto.latitud = p.latitud;
    dto.longitud = p.longitud;
    dto.urlLogo = p.urlLogo;
    dto.saldoRecargado = p.saldoRecargado;
    dto.limiteCredito = p.limiteCredito.toString();
    dto.creadoEn = p.creadoEn;
    dto.actualizadoEn = p.actualizadoEn;
    return dto;
  }
}

export class ZonaRepartidorDto {
  @ApiProperty({ format: 'uuid' })
  zonaId!: string;

  @ApiProperty()
  codigo!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  esPrimaria!: boolean;

  static desde(zr: ZonaRepartidor & { zona: Zona }): ZonaRepartidorDto {
    const dto = new ZonaRepartidorDto();
    dto.zonaId = zr.zonaId;
    dto.codigo = zr.zona.codigo;
    dto.nombre = zr.zona.nombre;
    dto.esPrimaria = zr.esPrimaria;
    return dto;
  }
}

export class PerfilRepartidorDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  tipoVehiculo!: string;

  @ApiProperty({ nullable: true })
  placa!: string | null;

  @ApiProperty()
  documentoIdentidad!: string;

  @ApiProperty({ nullable: true })
  telefonoEmergencia!: string | null;

  @ApiProperty()
  disponible!: boolean;

  @ApiProperty({ nullable: true })
  latitudActual!: number | null;

  @ApiProperty({ nullable: true })
  longitudActual!: number | null;

  @ApiProperty({ nullable: true, type: Date })
  ultimaUbicacionEn!: Date | null;

  @ApiProperty()
  calificacion!: number;

  @ApiProperty()
  totalEntregas!: number;

  @ApiProperty({ type: [ZonaRepartidorDto] })
  zonas!: ZonaRepartidorDto[];

  @ApiProperty({ type: Date })
  creadoEn!: Date;

  @ApiProperty({ type: Date })
  actualizadoEn!: Date;

  static desde(
    p: PerfilRepartidor & { zonas: (ZonaRepartidor & { zona: Zona })[] },
  ): PerfilRepartidorDto {
    const dto = new PerfilRepartidorDto();
    dto.id = p.id;
    dto.tipoVehiculo = p.tipoVehiculo;
    dto.placa = p.placa;
    dto.documentoIdentidad = p.documentoIdentidad;
    dto.telefonoEmergencia = p.telefonoEmergencia;
    dto.disponible = p.disponible;
    dto.latitudActual = p.latitudActual;
    dto.longitudActual = p.longitudActual;
    dto.ultimaUbicacionEn = p.ultimaUbicacionEn;
    dto.calificacion = p.calificacion;
    dto.totalEntregas = p.totalEntregas;
    dto.zonas = p.zonas.map((z) => ZonaRepartidorDto.desde(z));
    dto.creadoEn = p.creadoEn;
    dto.actualizadoEn = p.actualizadoEn;
    return dto;
  }
}

export type UsuarioConPerfiles = Usuario & {
  perfilAdmin: PerfilAdmin | null;
  perfilVendedor: PerfilVendedor | null;
  perfilRepartidor:
    | (PerfilRepartidor & { zonas: (ZonaRepartidor & { zona: Zona })[] })
    | null;
};

export class UsuarioDetalleDto extends UsuarioPublicoDto {
  @ApiProperty({ type: PerfilAdminDto, nullable: true })
  perfilAdmin!: PerfilAdminDto | null;
 

  @ApiProperty({ type: PerfilRepartidorDto, nullable: true })
  perfilRepartidor!: PerfilRepartidorDto | null;

  static desdeDetalle(usuario: UsuarioConPerfiles): UsuarioDetalleDto {
    const base = UsuarioPublicoDto.desde(usuario);
    const dto = Object.assign(new UsuarioDetalleDto(), base);
    dto.perfilAdmin = usuario.perfilAdmin
      ? PerfilAdminDto.desde(usuario.perfilAdmin)
      : null;
    dto.perfilVendedor = usuario.perfilVendedor
      ? PerfilVendedorDto.desde(usuario.perfilVendedor)
      : null;
    dto.perfilRepartidor = usuario.perfilRepartidor
      ? PerfilRepartidorDto.desde(usuario.perfilRepartidor)
      : null;
    return dto;
  }
}
