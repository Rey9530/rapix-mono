import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BancosServicio } from './bancos.servicio.js';
import { BancoDto } from './dto/banco.dto.js';

@ApiTags('Bancos')
@ApiBearerAuth('autenticacion-jwt')
@Controller('bancos')
export class BancosControlador {
  constructor(private readonly servicio: BancosServicio) {}

  @Get()
  @ApiOperation({ summary: 'Lista de bancos activos del catálogo' })
  listar(): Promise<BancoDto[]> {
    return this.servicio.listarActivos();
  }
}
