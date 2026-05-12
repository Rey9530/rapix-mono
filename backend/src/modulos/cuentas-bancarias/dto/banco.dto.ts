import { ApiProperty } from '@nestjs/swagger';
import type { Banco } from '../../../generated/prisma/client.js';

export class BancoDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'AGRICOLA' })
  codigo!: string;

  @ApiProperty({ example: 'Banco Agrícola' })
  nombre!: string;

  static desde(banco: Banco): BancoDto {
    const dto = new BancoDto();
    dto.id = banco.id;
    dto.codigo = banco.codigo;
    dto.nombre = banco.nombre;
    return dto;
  }
}
