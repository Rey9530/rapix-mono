import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Wrapper sobre flutter_secure_storage para tokens de sesion.
class AlmacenamientoSeguro {
  AlmacenamientoSeguro(this._almacen);

  final FlutterSecureStorage _almacen;

  static const _claveTokenAcceso = 'token_acceso';
  static const _claveTokenRefresco = 'token_refresco';
  static const _claveUsuario = 'usuario_json';

  Future<void> guardarTokens({
    required String tokenAcceso,
    required String tokenRefresco,
  }) async {
    await _almacen.write(key: _claveTokenAcceso, value: tokenAcceso);
    await _almacen.write(key: _claveTokenRefresco, value: tokenRefresco);
  }

  Future<String?> tokenAcceso() => _almacen.read(key: _claveTokenAcceso);
  Future<String?> tokenRefresco() => _almacen.read(key: _claveTokenRefresco);

  Future<void> guardarUsuario(String usuarioJson) =>
      _almacen.write(key: _claveUsuario, value: usuarioJson);

  Future<String?> usuario() => _almacen.read(key: _claveUsuario);

  Future<void> limpiar() async {
    await _almacen.delete(key: _claveTokenAcceso);
    await _almacen.delete(key: _claveTokenRefresco);
    await _almacen.delete(key: _claveUsuario);
  }
}

final almacenamientoSeguroProvider = Provider<AlmacenamientoSeguro>((ref) {
  return AlmacenamientoSeguro(
    const FlutterSecureStorage(
      aOptions: AndroidOptions(encryptedSharedPreferences: true),
    ),
  );
});
