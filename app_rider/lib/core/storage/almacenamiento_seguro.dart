import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AlmacenamientoSeguro {
  static const _claveAcceso = 'token_acceso';
  static const _claveRefresco = 'token_refresco';
  static const _claveUsuario = 'usuario_json';

  final FlutterSecureStorage _almacen;

  AlmacenamientoSeguro({FlutterSecureStorage? almacen})
      : _almacen = almacen ?? const FlutterSecureStorage();

  Future<void> guardarTokens({
    required String tokenAcceso,
    required String tokenRefresco,
  }) async {
    await _almacen.write(key: _claveAcceso, value: tokenAcceso);
    await _almacen.write(key: _claveRefresco, value: tokenRefresco);
  }

  Future<String?> tokenAcceso() => _almacen.read(key: _claveAcceso);

  Future<String?> tokenRefresco() => _almacen.read(key: _claveRefresco);

  Future<void> guardarUsuario(String usuarioJson) =>
      _almacen.write(key: _claveUsuario, value: usuarioJson);

  Future<String?> usuario() => _almacen.read(key: _claveUsuario);

  Future<void> limpiar() async {
    await _almacen.delete(key: _claveAcceso);
    await _almacen.delete(key: _claveRefresco);
    await _almacen.delete(key: _claveUsuario);
  }
}
