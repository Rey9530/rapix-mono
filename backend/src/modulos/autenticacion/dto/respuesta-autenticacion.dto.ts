import { ApiProperty } from '@nestjs/swagger';
import { UsuarioPublicoDto } from './usuario-publico.dto.js';

export class RespuestaAutenticacionDto {
  @ApiProperty({ type: UsuarioPublicoDto })
  usuario!: UsuarioPublicoDto;

  @ApiProperty({ description: 'JWT de acceso (TTL 15m por defecto)' })
  tokenAcceso!: string;

  @ApiProperty({ description: 'JWT de refresco (TTL 7d por defecto)' })
  tokenRefresco!: string;
}
