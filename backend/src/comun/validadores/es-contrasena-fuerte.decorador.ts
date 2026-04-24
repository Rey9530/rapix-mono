import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Requisitos: 8-64 caracteres, al menos una mayúscula, un número y un símbolo.
const REGEX_SIMBOLO = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/;

@ValidatorConstraint({ async: false })
class EsContrasenaFuerteConstraint implements ValidatorConstraintInterface {
  validate(valor: unknown): boolean {
    if (typeof valor !== 'string') return false;
    if (valor.length < 8 || valor.length > 64) return false;
    if (!/[A-Z]/.test(valor)) return false;
    if (!/[0-9]/.test(valor)) return false;
    if (!REGEX_SIMBOLO.test(valor)) return false;
    return true;
  }

  defaultMessage(): string {
    return 'La contraseña debe tener entre 8 y 64 caracteres e incluir al menos una mayúscula, un número y un símbolo.';
  }
}

export function EsContrasenaFuerte(opciones?: ValidationOptions): PropertyDecorator {
  return (objeto, propiedad) => {
    registerDecorator({
      target: objeto.constructor,
      propertyName: propiedad as string,
      options: opciones,
      validator: EsContrasenaFuerteConstraint,
    });
  };
}
