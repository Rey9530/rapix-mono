import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Publico } from '../../comun/decoradores/publico.decorador.js';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { AplicacionMovil } from '../../generated/prisma/client.js';
import { ConfiguracionServicio } from './configuracion.servicio.js';
import { ActualizarVersionAppDto } from './dto/actualizar-version-app.dto.js';

@ApiTags('Configuración')
@Controller('configuracion')
export class ConfiguracionControlador {
  constructor(private readonly servicio: ConfiguracionServicio) {}

  @Publico()
  @Get('version-app/:aplicacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Versión mínima requerida de una app móvil (público)',
  })
  @ApiParam({ name: 'aplicacion', enum: AplicacionMovil })
  obtenerVersionApp(
    @Param('aplicacion', new ParseEnumPipe(AplicacionMovil))
    aplicacion: AplicacionMovil,
  ) {
    return this.servicio.obtenerVersionApp(aplicacion);
  }

  @Roles('ADMIN')
  @ApiBearerAuth('autenticacion-jwt')
  @Patch('version-app/:aplicacion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar versión mínima requerida de una app móvil (ADMIN)',
  })
  @ApiParam({ name: 'aplicacion', enum: AplicacionMovil })
  actualizarVersionApp(
    @Param('aplicacion', new ParseEnumPipe(AplicacionMovil))
    aplicacion: AplicacionMovil,
    @Body() dto: ActualizarVersionAppDto,
  ) {
    return this.servicio.actualizarVersionApp(aplicacion, dto);
  }
}
