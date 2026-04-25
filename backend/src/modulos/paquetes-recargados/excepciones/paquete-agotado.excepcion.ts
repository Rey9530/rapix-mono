import { ConflictException } from '@nestjs/common';

export class PaqueteAgotadoException extends ConflictException {
  constructor() {
    super({
      codigo: 'PAQUETE_AGOTADO',
      mensaje: 'El paquete recargado se agotó durante la operación',
    });
  }
}
