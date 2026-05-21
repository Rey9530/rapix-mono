import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../../../nucleo/config/entorno.dart';

/// Excepcion al obtener el idToken de Google. Se traduce en un mensaje
/// amigable en el controlador.
class GoogleSignInFalloException implements Exception {
  GoogleSignInFalloException(this.mensaje);
  final String mensaje;

  @override
  String toString() => mensaje;
}

class GoogleSignInServicio {
  GoogleSignInServicio()
      : _cliente = GoogleSignIn(
          scopes: const ['email', 'profile', 'openid'],
          // serverClientId hace que en Android el idToken devuelto tenga
          // como audience el Web Client ID, no el Android. El backend lo
          // valida con google-auth-library.
          serverClientId: Entorno.googleClientIdWeb.isEmpty
              ? null
              : Entorno.googleClientIdWeb,
        );

  final GoogleSignIn _cliente;

  /// Inicia el flujo nativo de Google. Devuelve el idToken o null si el
  /// usuario cancelo el dialogo. Lanza [GoogleSignInFalloException] si
  /// Google reporta un error o no devuelve idToken.
  Future<String?> obtenerIdToken() async {
    final cuenta = await _cliente.signIn();
    if (cuenta == null) return null; // cancelo

    final auth = await cuenta.authentication;
    final idToken = auth.idToken;
    if (idToken == null || idToken.isEmpty) {
      throw GoogleSignInFalloException(
        'Google no devolvio un idToken. Verifica la configuracion de OAuth en '
        'Google Cloud Console.',
      );
    }
    return idToken;
  }

  /// Cierra la sesion local de Google y desconecta. Necesario para que la
  /// proxima vez vuelva a mostrar el selector de cuentas.
  Future<void> cerrarSesion() async {
    try {
      await _cliente.signOut();
      await _cliente.disconnect();
    } catch (_) {
      // disconnect() lanza si no habia conexion previa; lo ignoramos.
    }
  }
}

final googleSignInServicioProvider = Provider<GoogleSignInServicio>((ref) {
  return GoogleSignInServicio();
});
