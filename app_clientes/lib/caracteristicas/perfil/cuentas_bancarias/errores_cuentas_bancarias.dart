import 'package:dio/dio.dart';

const _mensajesPorCodigo = <String, String>{
  'CUENTA_DUPLICADA':
      'Ya tienes registrada una cuenta con ese banco y número.',
  'CUENTA_NO_ENCONTRADA': 'La cuenta bancaria no existe.',
  'BANCO_NO_ENCONTRADO': 'El banco seleccionado no está disponible.',
  'REASIGNAR_PRINCIPAL_PRIMERO':
      'Marca otra cuenta como principal antes de eliminar la actual.',
  'DEBE_HABER_PRINCIPAL':
      'Debes marcar otra cuenta como principal antes de desmarcar esta.',
  'SOLO_VENDEDORES':
      'Solo los vendedores pueden gestionar cuentas bancarias.',
  'PERFIL_VENDEDOR_NO_ENCONTRADO':
      'Tu cuenta no tiene perfil de vendedor.',
};

String formatearErrorCuenta(Object error) {
  if (error is DioException) {
    final data = error.response?.data;
    if (data is Map) {
      final codigo = data['codigo'];
      if (codigo is String && _mensajesPorCodigo.containsKey(codigo)) {
        return _mensajesPorCodigo[codigo]!;
      }
      final mensaje = data['mensaje'] ?? data['message'];
      if (mensaje is String && mensaje.isNotEmpty) return mensaje;
      if (mensaje is List && mensaje.isNotEmpty) {
        return mensaje.first.toString();
      }
    }
    return 'No fue posible completar la operación. Intenta de nuevo.';
  }
  return 'Ocurrió un error inesperado.';
}
