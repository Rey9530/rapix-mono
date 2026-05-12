import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { UsuarioActual } from '../../comun/decoradores/usuario-actual.decorador.js';
import type { Usuario } from '../../generated/prisma/client.js';
import { CuentasBancariasServicio } from './cuentas-bancarias.servicio.js';
import { ActualizarCuentaBancariaDto } from './dto/actualizar-cuenta-bancaria.dto.js';
import { CrearCuentaBancariaDto } from './dto/crear-cuenta-bancaria.dto.js';
import { CuentaBancariaDto } from './dto/cuenta-bancaria.dto.js';

@ApiTags('Cuentas bancarias')
@ApiBearerAuth('autenticacion-jwt')
@Roles('VENDEDOR')
@Controller('usuarios/yo/cuentas-bancarias')
export class CuentasBancariasControlador {
  constructor(private readonly servicio: CuentasBancariasServicio) {}

  @Get()
  @ApiOperation({ summary: 'Lista las cuentas bancarias del vendedor autenticado' })
  listar(@UsuarioActual() usuario: Usuario): Promise<CuentaBancariaDto[]> {
    return this.servicio.listar(usuario);
  }

  @Post()
  @ApiOperation({ summary: 'Registra una nueva cuenta bancaria' })
  crear(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: CrearCuentaBancariaDto,
  ): Promise<CuentaBancariaDto> {
    return this.servicio.crear(usuario, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Edita alias, tipo de cuenta o el flag esPrincipal de la cuenta. El banco y número no son editables.',
  })
  actualizar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarCuentaBancariaDto,
  ): Promise<CuentaBancariaDto> {
    return this.servicio.actualizar(usuario, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina (soft-delete) la cuenta bancaria' })
  eliminar(
    @UsuarioActual() usuario: Usuario,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.servicio.eliminar(usuario, id);
  }
}
