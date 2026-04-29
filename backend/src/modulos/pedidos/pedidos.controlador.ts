import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { AsignacionServicio } from './asignacion.servicio.js';
import { ActualizarPedidoDto } from './dto/actualizar-pedido.dto.js';
import { AsignarMultiplePedidosDto } from './dto/asignar-multiple-pedidos.dto.js';
import { AsignarPedidoDto } from './dto/asignar-pedido.dto.js';
import { CancelarPedidoDto } from './dto/cancelar-pedido.dto.js';
import { CrearPedidoDto } from './dto/crear-pedido.dto.js';
import { FiltrosPedidoDto } from './dto/filtros-pedido.dto.js';
import {
  DevolverPedidoDto,
  EnTransitoPedidoDto,
  EntregarPedidoDto,
  FallarPedidoDto,
  LlegarIntercambioPedidoDto,
  RecogerPedidoDto,
  ReintentarPedidoDto,
  TomarEntregaPedidoDto,
} from './dto/transiciones-rider.dto.js';
import { PedidosServicio } from './pedidos.servicio.js';

// Tipo mínimo para archivos de Multer — evita depender de los tipos de Express.Multer.
interface ArchivoMultipart {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
  fieldname: string;
}

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosControlador {
  constructor(
    private readonly servicio: PedidosServicio,
    private readonly asignacion: AsignacionServicio,
  ) {}

  // ─── Público — tracking (3.8) ─────────────────────
  @Publico()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Get('seguimiento/:codigo')
  @ApiOperation({ summary: 'Tracking público por codigoSeguimiento (no login)' })
  seguimiento(@Param('codigo') codigo: string) {
    return this.servicio.obtenerPorCodigo(codigo);
  }

  // ─── Asignación automática (batch) — ADMIN ────────
  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Post('asignar-automatico')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Asignar todos los pedidos pendientes (batch)' })
  asignarAutomatico(@UsuarioActual() usuario: Usuario) {
    return this.asignacion.asignarAutomaticoBatch(usuario.id);
  }

  // ─── Asignación múltiple manual — ADMIN ───────────
  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Post('asignar-multiple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Asignar varios pedidos al mismo repartidor en un solo llamado',
  })
  asignarMultiple(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: AsignarMultiplePedidosDto,
  ) {
    return this.asignacion.asignarMultiple(usuario, dto);
  }

  // ─── Crear / listar / detalle ─────────────────────

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('VENDEDOR')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Crear pedido (VENDEDOR) — multipart con campo opcional "foto"',
  })
  @UseInterceptors(FileInterceptor('foto'))
  crear(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: CrearPedidoDto,
    @UploadedFile() foto?: ArchivoMultipart,
  ) {
    return this.servicio.crear(
      usuario,
      dto,
      foto
        ? { buffer: foto.buffer, mimetype: foto.mimetype, originalname: foto.originalname }
        : undefined,
    );
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Get()
  @ApiOperation({ summary: 'Listar pedidos (scoping por rol)' })
  listar(@UsuarioActual() usuario: Usuario, @Query() filtros: FiltrosPedidoDto) {
    return this.servicio.listar(usuario, filtros);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Get(':id')
  @ApiOperation({ summary: 'Detalle + timeline + comprobantes' })
  obtenerPorId(@UsuarioActual() usuario: Usuario, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtenerPorId(usuario, id);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Get(':id/eventos')
  @ApiOperation({ summary: 'Timeline paginado de eventos' })
  eventos(@UsuarioActual() usuario: Usuario, @Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.listarEventos(usuario, id);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('VENDEDOR', 'ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar (solo PENDIENTE_ASIGNACION)' })
  actualizar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarPedidoDto,
  ) {
    return this.servicio.actualizar(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('VENDEDOR', 'ADMIN')
  @Post(':id/cancelar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar pedido (respeta máquina de estados)' })
  cancelar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelarPedidoDto,
  ) {
    return this.servicio.cancelar(usuario, id, dto);
  }

  // ─── Asignación — ADMIN (3.9) ─────────────────────

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('ADMIN')
  @Post(':id/asignar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Asignar manualmente un repartidor (ADMIN)' })
  asignarManual(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AsignarPedidoDto,
  ) {
    return this.asignacion.asignarManual(usuario, id, dto);
  }

  // ─── Ciclo de vida rider (3.6) ────────────────────

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/recoger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ASIGNADO → RECOGIDO' })
  recoger(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecogerPedidoDto,
  ) {
    return this.servicio.recoger(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/en-transito')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'RECOGIDO → EN_TRANSITO' })
  enTransito(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnTransitoPedidoDto,
  ) {
    return this.servicio.enTransito(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/llegar-intercambio')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'EN_TRANSITO → EN_PUNTO_INTERCAMBIO' })
  llegarIntercambio(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: LlegarIntercambioPedidoDto,
  ) {
    return this.servicio.llegarIntercambio(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/tomar-entrega')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'EN_PUNTO_INTERCAMBIO → EN_REPARTO (se asigna como repartidorEntrega)' })
  tomarEntrega(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TomarEntregaPedidoDto,
  ) {
    return this.servicio.tomarEntrega(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/entregar')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'EN_REPARTO → ENTREGADO (multipart con foto obligatoria)' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto', maxCount: 1 },
      { name: 'firma', maxCount: 1 },
    ]),
  )
  entregar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EntregarPedidoDto,
    @UploadedFiles() archivos: { foto?: ArchivoMultipart[]; firma?: ArchivoMultipart[] },
  ) {
    const foto = archivos?.foto?.[0];
    if (!foto) {
      throw new BadRequestException('El archivo "foto" es obligatorio');
    }
    const firma = archivos?.firma?.[0];
    return this.servicio.entregar(usuario, id, dto, {
      foto: { buffer: foto.buffer, mimetype: foto.mimetype, originalname: foto.originalname },
      firma: firma
        ? { buffer: firma.buffer, mimetype: firma.mimetype, originalname: firma.originalname }
        : undefined,
    });
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/fallar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'EN_REPARTO → FALLIDO (requiere motivo)' })
  fallar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FallarPedidoDto,
  ) {
    return this.servicio.fallar(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/reintentar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'FALLIDO → EN_REPARTO (reintento)' })
  reintentar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReintentarPedidoDto,
  ) {
    return this.servicio.reintentar(usuario, id, dto);
  }

  @ApiBearerAuth('autenticacion-jwt')
  @Roles('REPARTIDOR')
  @Post(':id/devolver')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'FALLIDO → DEVUELTO (devolver al vendedor)' })
  devolver(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DevolverPedidoDto,
  ) {
    return this.servicio.devolver(usuario, id, dto);
  }
}
