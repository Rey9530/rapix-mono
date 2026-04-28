import { ApiProperty } from '@nestjs/swagger';
import type { EstadoUsuario, RolUsuario, Usuario } from '../../../generated/prisma/client.js';

// Vista pública del Usuario — nunca expone hashContrasena.
export class UsuarioPublicoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'usuario@delivery.com' })
  email!: string;

  @ApiProperty({ example: '+50370001234' })
  telefono!: string;

  @ApiProperty()
  nombreCompleto!: string; 

  @ApiProperty({ enum: ['ADMIN', 'VENDEDOR', 'REPARTIDOR', 'CLIENTE'] })
  rol!: RolUsuario;

  @ApiProperty({ enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO', 'PENDIENTE_VERIFICACION'] })
  estado!: EstadoUsuario;

  @ApiProperty({ nullable: true })
  urlAvatar!: string | null;

  @ApiProperty({ nullable: true, type: Date })
  ultimoIngresoEn!: Date | null;

  @ApiProperty({ type: Date })
  creadoEn!: Date;

  @ApiProperty({ type: Date })
  actualizadoEn!: Date;

  @ApiProperty({ nullable: true })
  perfilVendedor?: any; // Se incluye para conveniencia, aunque idealmente habría un DTO específico para vendedores.

  static desde(usuario: any): UsuarioPublicoDto {
    const dto = new UsuarioPublicoDto();
    dto.id = usuario.id;
    dto.email = usuario.email;
    dto.telefono = usuario.telefono;
    dto.nombreCompleto = usuario.nombreCompleto;
    dto.rol = usuario.rol;
    dto.estado = usuario.estado;
    dto.urlAvatar = usuario.urlAvatar;
    dto.ultimoIngresoEn = usuario.ultimoIngresoEn;
    dto.creadoEn = usuario.creadoEn;
    dto.actualizadoEn = usuario.actualizadoEn;
    dto.perfilVendedor = usuario.perfilVendedor; 
    return dto;
  }
}
