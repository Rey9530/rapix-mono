/// Helpers de parseo seguro para valores numéricos provenientes de JSON.
///
/// Toleran que el backend serialice un campo numérico como `String`
/// (caso típico de `Decimal` de Prisma → `"15.50"` en JSON) en lugar de
/// `num`. Sin estos helpers, un cast directo `(json['x'] as num?)?.toDouble()`
/// lanza `type 'String' is not a subtype of type 'num?' in type cast`.

double? parseDoubleSeguro(dynamic valor) {
  if (valor == null) return null;
  if (valor is num) return valor.toDouble();
  if (valor is String) return double.tryParse(valor.trim());
  return null;
}

double parseDoubleSeguroODefault(dynamic valor, {double porDefecto = 0}) =>
    parseDoubleSeguro(valor) ?? porDefecto;

int? parseIntSeguro(dynamic valor) {
  if (valor == null) return null;
  if (valor is int) return valor;
  if (valor is num) return valor.toInt();
  if (valor is String) {
    final t = valor.trim();
    return int.tryParse(t) ?? double.tryParse(t)?.toInt();
  }
  return null;
}

int parseIntSeguroODefault(dynamic valor, {int porDefecto = 0}) =>
    parseIntSeguro(valor) ?? porDefecto;
