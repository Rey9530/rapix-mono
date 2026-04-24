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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import { RespuestaPaginada } from '../../comun/dto/respuesta-paginada.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { UsuarioPublicoDto } from '../autenticacion/dto/usuario-publico.dto.js';
import { ActualizarEstadoUsuarioDto } from './dto/actualizar-estado-usuario.dto.js';
import { ActualizarPerfilPropioDto } from './dto/actualizar-perfil-propio.dto.js';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto.js';
import { CrearUsuarioDto } from './dto/crear-usuario.dto.js';
import { ListarUsuariosDto } from './dto/listar-usuarios.dto.js';
import { UsuariosServicio } from './usuarios.servicio.js';

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
  obtenerPorId(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioPublicoDto> {
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
}
