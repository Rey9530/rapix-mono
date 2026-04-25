import { ConflictException } from '@nestjs/common';

export class TransicionInvalidaException extends ConflictException {
  constructor(desde: string, hacia: string) {
    super({
      codigo: 'PEDIDO_TRANSICION_INVALIDA',
      mensaje: `Transición de ${desde} a ${hacia} no está permitida`,
    });
  }
}
