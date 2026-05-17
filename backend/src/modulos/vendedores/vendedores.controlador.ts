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
import { CrearDepositoVendedorDto } from './dto/crear-deposito-vendedor.dto.js';
import { FiltrosDepositosAdminDto } from './dto/filtros-depositos-admin.dto.js';
import { FiltrosHistorialDepositosDto } from './dto/filtros-historial-depositos.dto.js';
import { VendedoresServicio } from './vendedores.servicio.js';

interface ArchivoMultipart {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
  fieldname: string;
}

@ApiTags('Vendedores')
@ApiBearerAuth('autenticacion-jwt')
@Controller('vendedores')
export class VendedoresControlador {
  constructor(private readonly servicio: VendedoresServicio) {}

  // ──────────────────────────────────────────────────
  // VENDEDOR — self-service
  // ──────────────────────────────────────────────────

  @Roles('VENDEDOR')
  @Get('yo/saldo-pendiente')
  @ApiOperation({
    summary:
      'Total y lista de paquetes CONTRA_ENTREGA entregados pendientes de deposito',
  })
  saldoPendiente(@UsuarioActual() usuario: Usuario) {
    return this.servicio.obtenerSaldoPendiente(usuario);
  }

  @Roles('VENDEDOR')
  @Get('yo/historial-depositos')
  @ApiOperation({
    summary: 'Historial paginado de depositos hechos al vendedor',
  })
  historialDepositos(
    @UsuarioActual() usuario: Usuario,
    @Query() filtros: FiltrosHistorialDepositosDto,
  ) {
    return this.servicio.listarHistorialDepositos(usuario, filtros);
  }

  @Roles('VENDEDOR')
  @Get('yo/depositos/:depositoId')
  @ApiOperation({
    summary:
      'Detalle de un deposito propio (paquetes, cuenta bancaria, comprobante)',
  })
  obtenerMiDeposito(
    @UsuarioActual() usuario: Usuario,
    @Param('depositoId', ParseUUIDPipe) depositoId: string,
  ) {
    return this.servicio.obtenerDepositoDeVendedor(usuario, depositoId);
  }

  // ──────────────────────────────────────────────────
  // ADMIN — gestion de depositos
  // Nota: las rutas estaticas (depositos) van antes que las dinamicas
  // (:vendedorId/...) para que NestJS no las confunda.
  // ──────────────────────────────────────────────────

  @Roles('ADMIN')
  @Get('depositos')
  @ApiOperation({
    summary: 'ADMIN: historial paginado de depositos a vendedores',
  })
  listarDepositos(@Query() filtros: FiltrosDepositosAdminDto) {
    return this.servicio.listarDepositos(filtros);
  }

  @Roles('ADMIN')
  @Post('depositos')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'comprobante', maxCount: 1 }]),
  )
  @ApiOperation({ summary: 'ADMIN: registrar un deposito al vendedor en lote' })
  crearDeposito(
    @Body() dto: CrearDepositoVendedorDto,
    @UploadedFiles() archivos: { comprobante?: ArchivoMultipart[] },
  ) {
    const foto = archivos?.comprobante?.[0];
    if (!foto) {
      throw new BadRequestException('El archivo "comprobante" es obligatorio');
    }
    return this.servicio.crearDeposito(dto, {
      buffer: foto.buffer,
      mimetype: foto.mimetype,
      originalname: foto.originalname,
    });
  }

  @Roles('ADMIN')
  @Get('depositos/:depositoId')
  @ApiOperation({
    summary: 'ADMIN: detalle completo de un deposito',
  })
  obtenerDeposito(
    @Param('depositoId', ParseUUIDPipe) depositoId: string,
  ) {
    return this.servicio.obtenerDepositoPorId(depositoId);
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({
    summary: 'ADMIN: lista vendedores (para selectores en el admin)',
  })
  listarVendedores() {
    return this.servicio.listarVendedores();
  }

  @Roles('ADMIN')
  @Get(':vendedorId/saldo-pendiente')
  @ApiOperation({ summary: 'ADMIN: saldo pendiente de un vendedor especifico' })
  saldoPendienteAdmin(
    @Param('vendedorId', ParseUUIDPipe) vendedorId: string,
  ) {
    return this.servicio.obtenerSaldoPendientePorVendedorId(vendedorId);
  }

  @Roles('ADMIN')
  @Get(':vendedorId/cuentas-bancarias')
  @ApiOperation({
    summary: 'ADMIN: cuentas bancarias activas de un vendedor especifico',
  })
  cuentasBancariasDeVendedor(
    @Param('vendedorId', ParseUUIDPipe) vendedorId: string,
  ) {
    return this.servicio.listarCuentasBancariasDeVendedor(vendedorId);
  }
}
