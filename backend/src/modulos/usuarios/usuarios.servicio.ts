import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import { hashearContrasena } from '../../comun/utiles/contrasena.js';
import type { EstadoUsuario, Prisma, Usuario } from '../../generated/prisma/client.js';
import { PrismaServicio } from '../../prisma/prisma.servicio.js';
import { ArchivosServicio } from '../archivos/archivos.servicio.js';
import { UsuarioPublicoDto } from '../autenticacion/dto/usuario-publico.dto.js';
import { RepartidoresServicio } from '../repartidores/repartidores.servicio.js';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto.js';
import { ActualizarPerfilPropioDto } from './dto/actualizar-perfil-propio.dto.js';
import { ActualizarPerfilVendedorDto } from './dto/actualizar-perfil-vendedor.dto.js';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { UsuarioDetalleDto } from './dto/usuario-detalle.dto.js';

const TRANSICIONES: Record<EstadoUsuario, EstadoUsuario[]> = {
  PENDIENTE_VERIFICACION: ['ACTIVO', 'INACTIVO'],
  ACTIVO: ['SUSPENDIDO', 'INACTIVO'],
  SUSPENDIDO: ['ACTIVO', 'INACTIVO'],
  INACTIVO: ['ACTIVO'],
};

@Injectable()
export class UsuariosServicio {
  private readonly logger = new Logger(UsuariosServicio.name);

  constructor(
    private readonly prisma: PrismaServicio,
    private readonly repartidores: RepartidoresServicio,
    private readonly archivos: ArchivosServicio,
  ) {}

  async listar(filtros: ListarUsuariosDto): Promise<RespuestaPaginada<UsuarioPublicoDto>> {
    const where: Prisma.UsuarioWhereInput = {};
    if (filtros.rol) where.rol = filtros.rol;
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.busqueda) {
      where.OR = [
        { email: { contains: filtros.busqueda, mode: 'insensitive' } },
        { telefono: { contains: filtros.busqueda } },
        { nombreCompleto: { contains: filtros.busqueda, mode: 'insensitive' } },
      ];
    }

    const skip = (filtros.pagina - 1) * filtros.limite;
    const [filas, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: filtros.limite,
        orderBy: { creadoEn: 'desc' },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return RespuestaPaginada.de(
      filas.map((u) => UsuarioPublicoDto.desde(u)),
      total,
      filtros.pagina,
      filtros.limite,
    );
  }

  async obtenerPorId(id: string): Promise<UsuarioDetalleDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        perfilAdmin: true,
        perfilVendedor: true,
        perfilRepartidor: {
          include: {
            zonas: { include: { zona: true } },
          },
        },
      },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return UsuarioDetalleDto.desdeDetalle(usuario);
  }

  obtenerYo(usuario: Usuario): UsuarioPublicoDto {
    return UsuarioPublicoDto.desde(usuario);
  }

  async actualizarYo(
    id: string,
    dto: ActualizarPerfilPropioDto,
  ): Promise<UsuarioPublicoDto> {
    if (dto.telefono) {
      const otro = await this.prisma.usuario.findUnique({
        where: { telefono: dto.telefono },
      });
      if (otro && otro.id !== id) {
        throw new ConflictException('El teléfono ya está registrado');
      }
    }

    const actualizado = await this.prisma.usuario.update({
      where: { id },
      data: {
        telefono: dto.telefono,
        nombreCompleto: dto.nombreCompleto,
        urlAvatar: dto.urlAvatar,
      },
    });
    return UsuarioPublicoDto.desde(actualizado);
  }

  async crear(dto: CrearUsuarioDto): Promise<UsuarioPublicoDto> {
    const existente = await this.prisma.usuario.findFirst({
      where: { OR: [{ email: dto.email }, { telefono: dto.telefono }] },
    });
    if (existente) {
      throw new ConflictException(
        existente.email === dto.email
          ? 'El email ya está registrado'
          : 'El teléfono ya está registrado',
      );
    }

    const hash = await hashearContrasena(dto.contrasena);

    const usuario = await this.prisma.$transaction(async (tx) => {
      const creado = await tx.usuario.create({
        data: {
          email: dto.email,
          telefono: dto.telefono,
          hashContrasena: hash,
          nombreCompleto: dto.nombreCompleto,
          rol: dto.rol,
          // Usuarios creados por un admin arrancan activos; el registro público
          // deja PENDIENTE_VERIFICACION para que luego medie verificación de email.
          estado: 'ACTIVO',
        },
      });

      if (dto.rol === 'ADMIN') {
        await tx.perfilAdmin.create({
          data: { usuarioId: creado.id, permisos: dto.permisos ?? [] },
        });
      } else if (dto.rol === 'VENDEDOR') {
        if (!dto.nombreNegocio || !dto.direccion || dto.latitud === undefined || dto.longitud === undefined) {
          throw new BadRequestException(
            'Para rol VENDEDOR se requieren nombreNegocio, direccion, latitud y longitud',
          );
        }
        await tx.perfilVendedor.create({
          data: {
            usuarioId: creado.id,
            nombreNegocio: dto.nombreNegocio,
            direccion: dto.direccion,
            latitud: dto.latitud,
            longitud: dto.longitud,
          },
        });
      } else if (dto.rol === 'REPARTIDOR') {
        if (!dto.tipoVehiculo || !dto.documentoIdentidad) {
          throw new BadRequestException(
            'Para rol REPARTIDOR se requieren tipoVehiculo y documentoIdentidad',
          );
        }
        await this.repartidores.crearPerfil(
          creado.id,
          {
            tipoVehiculo: dto.tipoVehiculo,
            placa: dto.placa,
            documentoIdentidad: dto.documentoIdentidad,
            telefonoEmergencia: dto.telefonoEmergencia,
            zonaIds: dto.zonaIds,
            zonaPrimariaId: dto.zonaPrimariaId,
          },
          tx,
        );
      }

      return creado;
    });

    return UsuarioPublicoDto.desde(usuario);
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioPublicoDto> {
    const existente = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Usuario no encontrado');

    if (dto.email && dto.email !== existente.email) {
      const otro = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
      if (otro) throw new ConflictException('El email ya está registrado');
    }
    if (dto.telefono && dto.telefono !== existente.telefono) {
      const otro = await this.prisma.usuario.findUnique({
        where: { telefono: dto.telefono },
      });
      if (otro) throw new ConflictException('El teléfono ya está registrado');
    }

    const actualizado = await this.prisma.$transaction(async (tx) => {
      const u = await tx.usuario.update({
        where: { id },
        data: {
          email: dto.email,
          telefono: dto.telefono,
          nombreCompleto: dto.nombreCompleto,
          urlAvatar: dto.urlAvatar,
        },
      });
      if (dto.permisos !== undefined && existente.rol === 'ADMIN') {
        await tx.perfilAdmin.update({
          where: { usuarioId: id },
          data: { permisos: dto.permisos },
        });
      }
      return u;
    });

    return UsuarioPublicoDto.desde(actualizado);
  }

  async eliminar(id: string): Promise<UsuarioPublicoDto> {
    const existente = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Usuario no encontrado');
    if (existente.estado === 'INACTIVO') return UsuarioPublicoDto.desde(existente);

    const u = await this.prisma.usuario.update({
      where: { id },
      data: { estado: 'INACTIVO' },
    });
    return UsuarioPublicoDto.desde(u);
  }

  async cambiarEstado(
    id: string,
    dto: ActualizarEstadoUsuarioDto,
  ): Promise<UsuarioPublicoDto> {
    const existente = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Usuario no encontrado');

    if (existente.estado === dto.estado) {
      return UsuarioPublicoDto.desde(existente);
    }

    const permitidos = TRANSICIONES[existente.estado] ?? [];
    if (!permitidos.includes(dto.estado)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${existente.estado} → ${dto.estado}`,
      );
    }

    const u = await this.prisma.usuario.update({
      where: { id },
      data: { estado: dto.estado },
    });

    if (dto.motivo) {
      this.logger.log(
        `Usuario ${id} ${existente.estado}→${dto.estado}. Motivo: ${dto.motivo}`,
      );
    }

    return UsuarioPublicoDto.desde(u);
  }

  async actualizarPerfilVendedor(
    usuario: Usuario,
    dto: ActualizarPerfilVendedorDto,
    logo?: { buffer: Buffer; mimetype: string; originalname: string },
  ): Promise<UsuarioDetalleDto> {
    if (usuario.rol !== 'VENDEDOR') {
      throw new ForbiddenException(
        'Solo usuarios con rol VENDEDOR pueden actualizar el perfil de negocio',
      );
    }

    const perfil = await this.prisma.perfilVendedor.findUnique({
      where: { usuarioId: usuario.id },
    });
    if (!perfil) {
      throw new NotFoundException(
        'No existe perfil de vendedor para este usuario',
      );
    }

    const data: Prisma.PerfilVendedorUpdateInput = {};
    if (dto.nombreNegocio !== undefined) data.nombreNegocio = dto.nombreNegocio;
    if (dto.rfc !== undefined) data.rfc = dto.rfc;
    if (dto.direccion !== undefined) data.direccion = dto.direccion;
    if (dto.latitud !== undefined) data.latitud = dto.latitud;
    if (dto.longitud !== undefined) data.longitud = dto.longitud;

    if (logo) {
      const ext = logo.originalname.split('.').pop()?.toLowerCase() || 'jpg';
      const key = ArchivosServicio.armarKeyLogoVendedor(usuario.id, ext);
      const subido = await this.archivos.subir(logo.buffer, key, logo.mimetype);
      data.urlLogo = subido.url;
    }

    if (Object.keys(data).length === 0) {
      // Sin cambios — devolvemos el detalle actual.
      return this.obtenerPorId(usuario.id);
    }

    await this.prisma.perfilVendedor.update({
      where: { usuarioId: usuario.id },
      data,
    });

    return this.obtenerPorId(usuario.id);
  }
}
