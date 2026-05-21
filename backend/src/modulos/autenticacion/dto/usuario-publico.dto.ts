import { ApiProperty } from '@nestjs/swagger';
import type { EstadoUsuario, RolUsuario, Usuario } from '../../../generated/prisma/client.js';

export class EstadisticasUsuarioDto {
  @ApiProperty({ example: 247 })
  enviosTotales!: number;

  @ApiProperty({ example: 240 })
  enviosEntregados!: number;

  @ApiProperty({ example: 34 })
  saldoRecargado!: number;
}

// Vista pública del Usuario — nunca expone hashContrasena.
export class UsuarioPublicoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'usuario@delivery.com' })
  email!: string;

  @ApiProperty({
    nullable: true,
    example: '+50370001234',
    description:
      'Null cuando la cuenta fue creada vía OAuth y aún no ha completado el registro.',
  })
  telefono!: string | null;

  @ApiProperty()
  nombreCompleto!: string;

  @ApiProperty({ enum: ['ADMIN', 'VENDEDOR', 'REPARTIDOR', 'CLIENTE'] })
  rol!: RolUsuario;

  @ApiProperty({ enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'PENDIENTE_VERIFICACION'] })
  estado!: EstadoUsuario;

  @ApiProperty({
    description:
      'Indica si el usuario ya completó los datos obligatorios (teléfono + perfil de negocio para VENDEDOR). Si es false, la app debe llevarlo a la pantalla de completar registro.',
  })
  registroCompleto!: boolean;

  @ApiProperty({ nullable: true })
  urlAvatar!: string | null;

  @ApiProperty({ nullable: true, type: Date })
  ultimoIngresoEn!: Date | null;

  @ApiProperty({
    nullable: true,
    type: Date,
    description: 'Fecha en que el usuario verificó su correo electrónico, o null si aún no.',
  })
  correoVerificadoEn!: Date | null;

  @ApiProperty({ type: Date })
  creadoEn!: Date;

  @ApiProperty({ type: Date })
  actualizadoEn!: Date;

  @ApiProperty({ nullable: true })
  perfilVendedor?: any; // Se incluye para conveniencia, aunque idealmente habría un DTO específico para vendedores.

  @ApiProperty({
    type: EstadisticasUsuarioDto,
    nullable: true,
    description:
      'Solo presente para usuarios con perfil de vendedor. Contadores agregados de pedidos y saldo.',
  })
  estadisticas?: EstadisticasUsuarioDto;

  static desde(usuario: any, estadisticas?: EstadisticasUsuarioDto): UsuarioPublicoDto {
    const dto = new UsuarioPublicoDto();
    dto.id = usuario.id;
    dto.email = usuario.email;
    dto.telefono = usuario.telefono;
    dto.nombreCompleto = usuario.nombreCompleto;
    dto.rol = usuario.rol;
    dto.estado = usuario.estado;
    dto.registroCompleto = usuario.registroCompleto ?? false;
    dto.urlAvatar = usuario.urlAvatar;
    dto.ultimoIngresoEn = usuario.ultimoIngresoEn;
    dto.correoVerificadoEn = usuario.correoVerificadoEn ?? null;
    dto.creadoEn = usuario.creadoEn;
    dto.actualizadoEn = usuario.actualizadoEn;
    dto.perfilVendedor = usuario.perfilVendedor;
    if (estadisticas) dto.estadisticas = estadisticas;
    return dto;
  }
}
