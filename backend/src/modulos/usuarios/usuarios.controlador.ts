import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import { PaginacionDto } from '../../comun/dto/paginacion.dto.js';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { UsuarioPublicoDto } from '../autenticacion/dto/usuario-publico.dto.js';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto.js';
import { ActualizarPaqueteAsignadoDto } from './dto/actualizar-paquete-asignado.dto.js';
import { ActualizarPerfilPropioDto } from './dto/actualizar-perfil-propio.dto.js';
import { ActualizarPerfilVendedorDto } from './dto/actualizar-perfil-vendedor.dto.js';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';
import { AsignarPaqueteDto } from './dto/asignar-paquete.dto.js';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { UsuarioDetalleDto } from './dto/usuario-detalle.dto.js';
import { UsuariosServicio } from './usuarios.servicio.js';

interface ArchivoMultipart {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
  fieldname: string;
}

@ApiTags('Usuarios')
@ApiBearerAuth('autenticacion-jwt')
@Controller('usuarios')
export class UsuariosControlador {
  constructor(private readonly servicio: UsuariosServicio) {}

  // El endpoint /yo va antes de /:id para no ser tragado por la ruta dinámica.
  @Get('yo')
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  obtenerYo(@UsuarioActual() usuario: Usuario): UsuarioPublicoDto {
    return this.servicio.obtenerYo(usuario);
  }

  @Patch('yo')
  @ApiOperation({ summary: 'Actualiza el perfil propio (telefono, nombreCompleto, urlAvatar)' })
  actualizarYo(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: ActualizarPerfilPropioDto,
  ): Promise<UsuarioPublicoDto> {
    return this.servicio.actualizarYo(usuario.id, dto);
  }

  @Roles('VENDEDOR')
  @Patch('yo/perfil-vendedor')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary:
      'Actualiza el perfil del negocio del VENDEDOR autenticado (multipart, campo logo opcional)',
  })
  @UseInterceptors(FileInterceptor('logo'))
  actualizarPerfilVendedor(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: ActualizarPerfilVendedorDto,
    @UploadedFile() logo?: ArchivoMultipart,
  ): Promise<UsuarioDetalleDto> {
    return this.servicio.actualizarPerfilVendedor(
      usuario,
      dto,
      logo
        ? {
            buffer: logo.buffer,
            mimetype: logo.mimetype,
            originalname: logo.originalname,
          }
        : undefined,
    );
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Lista paginada de usuarios (ADMIN)' })
  listar(
    @Query() filtros: ListarUsuariosDto,
  ): Promise<RespuestaPaginada<UsuarioPublicoDto>> {
    return this.servicio.listar(filtros);
  }

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Crea un usuario de cualquier rol (ADMIN)' })
  crear(@Body() dto: CrearUsuarioDto): Promise<UsuarioPublicoDto> {
    return this.servicio.crear(dto);
  }

  @Roles('ADMIN')
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarEstadoUsuarioDto,
  ): Promise<UsuarioPublicoDto> {
    return this.servicio.cambiarEstado(id, dto);
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({
    summary: 'Detalle del usuario incluyendo perfil del rol (ADMIN)',
  })
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioDetalleDto> {
    return this.servicio.obtenerPorId(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  actualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarUsuarioDto,
  ): Promise<UsuarioPublicoDto> {
    return this.servicio.actualizar(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  eliminar(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioPublicoDto> {
    return this.servicio.eliminar(id);
  }

  // ──────────────────────────────────────────────────
  // Paquetes recargados asignados a un VENDEDOR (ADMIN)
  // ──────────────────────────────────────────────────

  @Roles('ADMIN')
  @Get(':id/paquetes')
  @ApiOperation({
    summary: 'Listado paginado de paquetes recargados del vendedor (ADMIN)',
  })
  listarPaquetes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filtros: PaginacionDto,
  ) {
    return this.servicio.listarPaquetesDeVendedor(id, filtros);
  }

  @Roles('ADMIN')
  @Post(':id/paquetes')
  @ApiOperation({
    summary:
      'Asigna manualmente un paquete recargado al vendedor (ADMIN). Permite definir enviosTotales y enviosRestantes.',
  })
  asignarPaquete(
    @UsuarioActual() admin: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AsignarPaqueteDto,
  ) {
    return this.servicio.asignarPaquete(id, dto, admin.id);
  }

  @Roles('ADMIN')
  @Patch(':id/paquetes/:paqueteId')
  @ApiOperation({
    summary:
      'Ajusta manualmente un paquete asignado (envíosRestantes, estado, expiraEn). ADMIN.',
  })
  actualizarPaquete(
    @UsuarioActual() admin: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('paqueteId', ParseUUIDPipe) paqueteId: string,
    @Body() dto: ActualizarPaqueteAsignadoDto,
  ) {
    return this.servicio.actualizarPaqueteAsignado(id, paqueteId, dto, admin.id);
  }
}
