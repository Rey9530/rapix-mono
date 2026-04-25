import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../comun/decoradores/roles.decorador.js';
import { ConsumoPaquetesDto } from './dto/consumo-paquetes.dto.js';
import { ReportesServicio } from './reportes.servicio.js';

@ApiTags('Reportes')
@ApiBearerAuth('autenticacion-jwt')
@Controller('reportes')
export class ReportesControlador {
  constructor(private readonly servicio: ReportesServicio) {}

  @Roles('ADMIN')
  @Get('consumo-paquetes')
  @ApiOperation({ summary: 'Consumo agregado de paquetes por vendedor (ADMIN)' })
  consumoPaquetes(@Query() dto: ConsumoPaquetesDto) {
    return this.servicio.consumoPaquetes(dto);
  }
}
