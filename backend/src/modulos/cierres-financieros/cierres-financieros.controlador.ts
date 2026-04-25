import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { CierresFinancierosServicio } from './cierres-financieros.servicio.js';
import { CrearCierreDto } from './dto/crear-cierre.dto.js';
import { FiltrosCierreDto } from './dto/filtros-cierre.dto.js';
import { RechazarCierreDto } from './dto/rechazar-cierre.dto.js';

interface ArchivoMultipart {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
  fieldname: string;
}

@ApiTags('Cierres Financieros')
@ApiBearerAuth('autenticacion-jwt')
@Controller('cierres-financieros')
export class CierresFinancierosControlador {
  constructor(private readonly servicio: CierresFinancierosServicio) {}

  // ─── Repartidor — rutas estáticas antes que /:id ──────────────────

  @Roles('REPARTIDOR')
  @Get('yo/hoy')
  @ApiOperation({ summary: 'Resumen del día (monto esperado y pedidos contra-entrega)' })
  resumenHoy(@UsuarioActual() usuario: Usuario) {
    return this.servicio.obtenerResumenHoy(usuario);
  }

  @Roles('REPARTIDOR')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Enviar cierre del día con foto de comprobante (multipart)' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'comprobanteFoto', maxCount: 1 }]))
  crear(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: CrearCierreDto,
    @UploadedFiles() archivos: { comprobanteFoto?: ArchivoMultipart[] },
  ) {
    const foto = archivos?.comprobanteFoto?.[0];
    if (!foto) {
      throw new BadRequestException('El archivo "comprobanteFoto" es obligatorio');
    }
    return this.servicio.crear(usuario, dto, {
      buffer: foto.buffer,
      mimetype: foto.mimetype,
      originalname: foto.originalname,
    });
  }

  // ─── Admin ────────────────────────────────────────────────────────

  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Listado paginado con filtros (ADMIN)' })
  listar(@Query() filtros: FiltrosCierreDto) {
    return this.servicio.listar(filtros);
  }

  // Detalle visible para ADMIN o el repartidor dueño.
  @Roles('ADMIN', 'REPARTIDOR')
  @Get(':id')
  @ApiOperation({ summary: 'Detalle del cierre (ADMIN o repartidor dueño)' })
  detalle(@UsuarioActual() usuario: Usuario, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtenerPorId(usuario, id);
  }

  @Roles('ADMIN')
  @Post(':id/aprobar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aprobar cierre (ADMIN)' })
  aprobar(@UsuarioActual() usuario: Usuario, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.aprobar(usuario, id);
  }

  @Roles('ADMIN')
  @Post(':id/rechazar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rechazar cierre con motivo (ADMIN)' })
  rechazar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RechazarCierreDto,
  ) {
    return this.servicio.rechazar(usuario, id, dto);
  }
}
