import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../datos/modelos/usuario.dart';
import '../../datos/repositorios/autenticacion_repositorio.dart';
import '../../datos/repositorios/tokens_dispositivo_repositorio.dart';
import '../../datos/repositorios/usuarios_repositorio.dart';
import '../../nucleo/almacenamiento/almacenamiento_seguro.dart';
import '../../nucleo/notificaciones/servicio_notificaciones.dart';
import 'servicios/google_sign_in_servicio.dart';

class AutenticacionEstado {
  AutenticacionEstado({
    this.usuario,
    this.cargando = false,
    this.inicializado = false,
    this.error,
    this.errorRed = false,
  });

  final Usuario? usuario;
  final bool cargando;
  final bool inicializado;
  final String? error;
  final bool errorRed;

  bool get autenticado => usuario != null;

  AutenticacionEstado copia({
    Usuario? usuario,
    bool? cargando,
    bool? inicializado,
    String? error,
    bool? errorRed,
    bool limpiarUsuario = false,
    bool limpiarError = false,
    bool limpiarErrorRed = false,
  }) {
    return AutenticacionEstado(
      usuario: limpiarUsuario ? null : (usuario ?? this.usuario),
      cargando: cargando ?? this.cargando,
      inicializado: inicializado ?? this.inicializado,
      error: limpiarError ? null : (error ?? this.error),
      errorRed: limpiarErrorRed ? false : (errorRed ?? this.errorRed),
    );
  }
}

class AutenticacionControlador extends StateNotifier<AutenticacionEstado> {
  AutenticacionControlador({
    required this.repositorio,
    required this.usuariosRepositorio,
    required this.almacen,
    required this.servicioNotificaciones,
    required this.tokensRepositorio,
    required this.googleSignIn,
  }) : super(AutenticacionEstado());

  final AutenticacionRepositorio repositorio;
  final UsuariosRepositorio usuariosRepositorio;
  final AlmacenamientoSeguro almacen;
  final ServicioNotificaciones servicioNotificaciones;
  final TokensDispositivoRepositorio tokensRepositorio;
  final GoogleSignInServicio googleSignIn;

  /// Verifica la sesion al arrancar la app: si hay tokenRefresco guardado,
  /// llama a /autenticacion/refrescar para renovar el par y obtener el
  /// usuario fresco. El splash invoca este metodo.
  ///
  /// - Sin tokenRefresco: estado inicializado sin usuario (va a login).
  /// - Refresh OK: guarda tokens nuevos y usuario, marca autenticado.
  /// - 401: limpia storage y queda sin usuario (va a login).
  /// - Error de red u otros: marca [errorRed] para que el splash muestre
  ///   pantalla de error con boton de reintentar (no limpia storage).
  Future<void> inicializarSesion() async {
    state = state.copia(
      cargando: true,
      limpiarError: true,
      limpiarErrorRed: true,
    );

    final tokenRefresco = await almacen.tokenRefresco();
    if (tokenRefresco == null || tokenRefresco.isEmpty) {
      state = AutenticacionEstado(inicializado: true);
      return;
    }

    try {
      final respuesta = await repositorio.refrescar(tokenRefresco);
      await almacen.guardarTokens(
        tokenAcceso: respuesta.tokenAcceso,
        tokenRefresco: respuesta.tokenRefresco,
      );
      await almacen.guardarUsuario(respuesta.usuario.aJsonString());
      state = AutenticacionEstado(
        usuario: respuesta.usuario,
        inicializado: true,
      );
      await _sincronizarTokenPush();
    } on DioException catch (e) {
      final codigo = e.response?.statusCode;
      // Si hubo respuesta del servidor en el rango 4xx, el token es invalido
      // o esta mal formado: limpiar storage y mandar a login.
      if (codigo != null && codigo >= 400 && codigo < 500) {
        await almacen.limpiar();
        state = AutenticacionEstado(inicializado: true);
      } else {
        // Error de red, timeout o 5xx: mantener storage y permitir reintento.
        state = state.copia(
          inicializado: true,
          cargando: false,
          errorRed: true,
        );
      }
    } catch (_) {
      state = state.copia(
        inicializado: true,
        cargando: false,
        errorRed: true,
      );
    }
  }

  Future<bool> iniciarSesion({
    required String email,
    required String contrasena,
  }) async {
    state = state.copia(cargando: true, limpiarError: true);
    try {
      final respuesta = await repositorio.iniciarSesion(
        email: email,
        contrasena: contrasena,
      );
      await almacen.guardarTokens(
        tokenAcceso: respuesta.tokenAcceso,
        tokenRefresco: respuesta.tokenRefresco,
      );
      await almacen.guardarUsuario(respuesta.usuario.aJsonString());
      state = state.copia(
        usuario: respuesta.usuario,
        cargando: false,
      );
      await _sincronizarTokenPush();
      return true;
    } catch (e) {
      state = state.copia(cargando: false, error: _formatearError(e));
      return false;
    }
  }

  Future<bool> registrar({
    required String email,
    required String telefono,
    required String contrasena,
    required String nombreCompleto,
    String? nombreNegocio,
    String? direccion,
    double? latitud,
    double? longitud,
  }) async {
    state = state.copia(cargando: true, limpiarError: true);
    try {
      final respuesta = await repositorio.registrar(
        email: email,
        telefono: telefono,
        contrasena: contrasena,
        nombreCompleto: nombreCompleto,
        nombreNegocio: nombreNegocio,
        direccion: direccion,
        latitud: latitud,
        longitud: longitud,
      );
      await almacen.guardarTokens(
        tokenAcceso: respuesta.tokenAcceso,
        tokenRefresco: respuesta.tokenRefresco,
      );
      await almacen.guardarUsuario(respuesta.usuario.aJsonString());
      state = state.copia(
        usuario: respuesta.usuario,
        cargando: false,
      );
      await _sincronizarTokenPush();
      return true;
    } catch (e) {
      state = state.copia(cargando: false, error: _formatearError(e));
      return false;
    }
  }

  /// Flujo completo de Google Sign-In:
  /// 1) Abre el dialogo nativo de Google y obtiene idToken.
  /// 2) Lo envia al backend POST /autenticacion/google.
  /// 3) Persiste tokens + usuario.
  /// 4) Sincroniza FCM solo si registroCompleto=true. Si no, lo dejamos
  ///    para cuando complete el registro: no tiene sentido suscribir a
  ///    notificaciones de pedidos a alguien sin negocio configurado.
  ///
  /// Retorna true si el flujo termino con sesion activa (con o sin
  /// registro completo). Retorna false si el usuario cancelo el dialogo
  /// o si hubo error (en cuyo caso state.error queda con el mensaje).
  Future<bool> iniciarSesionConGoogle() async {
    state = state.copia(cargando: true, limpiarError: true);
    try {
      final idToken = await googleSignIn.obtenerIdToken();
      if (idToken == null) {
        // Usuario cancelo: no es un error.
        state = state.copia(cargando: false);
        return false;
      }
      final respuesta = await repositorio.iniciarSesionConGoogle(idToken);
      await almacen.guardarTokens(
        tokenAcceso: respuesta.tokenAcceso,
        tokenRefresco: respuesta.tokenRefresco,
      );
      await almacen.guardarUsuario(respuesta.usuario.aJsonString());
      state = state.copia(usuario: respuesta.usuario, cargando: false);
      if (respuesta.usuario.registroCompleto) {
        await _sincronizarTokenPush();
      }
      return true;
    } catch (e) {
      state = state.copia(cargando: false, error: _formatearError(e));
      return false;
    }
  }

  /// PATCH /autenticacion/completar-registro. Tras exito sincroniza el
  /// token FCM (ahora si tiene sentido) y actualiza el estado: el router
  /// reaccionara y redirigira a /inicio.
  Future<bool> completarRegistro({
    required String telefono,
    required String nombreNegocio,
    required String direccion,
    required double latitud,
    required double longitud,
  }) async {
    state = state.copia(cargando: true, limpiarError: true);
    try {
      final usuario = await repositorio.completarRegistro(
        telefono: telefono,
        nombreNegocio: nombreNegocio,
        direccion: direccion,
        latitud: latitud,
        longitud: longitud,
      );
      await almacen.guardarUsuario(usuario.aJsonString());
      state = state.copia(usuario: usuario, cargando: false);
      await _sincronizarTokenPush();
      return true;
    } catch (e) {
      state = state.copia(cargando: false, error: _formatearError(e));
      return false;
    }
  }

  Future<void> actualizarUsuario(Usuario usuario) async {
    await almacen.guardarUsuario(usuario.aJsonString());
    state = state.copia(usuario: usuario);
  }

  /// Vuelve a pedir el perfil del usuario al backend (incluye estadisticas
  /// y correoVerificadoEn). Pensado para el pull-to-refresh del perfil y
  /// para refrescar tras verificar el correo desde el navegador.
  Future<void> recargarUsuario() async {
    if (state.usuario == null) return;
    try {
      final fresco = await usuariosRepositorio.obtenerYo();
      await almacen.guardarUsuario(fresco.aJsonString());
      state = state.copia(usuario: fresco);
    } catch (_) {
      // Mantenemos el usuario previo si falla la red.
    }
  }

  /// Solicita al backend reenviar el correo de verificacion al usuario
  /// autenticado. Lanza [Exception] si la peticion falla (la UI lo captura
  /// para mostrar el snackbar correspondiente).
  Future<void> reenviarVerificacionCorreo() async {
    await repositorio.reenviarVerificacion();
  }

  Future<bool> solicitarRecuperacionContrasena({
    required String email,
  }) async {
    state = state.copia(cargando: true, limpiarError: true);
    try {
      await repositorio.solicitarRecuperacionContrasena(email: email);
      state = state.copia(cargando: false);
      return true;
    } catch (e) {
      state = state.copia(cargando: false, error: _formatearError(e));
      return false;
    }
  }

  Future<bool> confirmarRecuperacionContrasena({
    required String email,
    required String codigo,
    required String nuevaContrasena,
  }) async {
    state = state.copia(cargando: true, limpiarError: true);
    try {
      await repositorio.confirmarRecuperacionContrasena(
        email: email,
        codigo: codigo,
        nuevaContrasena: nuevaContrasena,
      );
      state = state.copia(cargando: false);
      return true;
    } catch (e) {
      state = state.copia(cargando: false, error: _formatearError(e));
      return false;
    }
  }

  Future<void> cerrarSesion() async {
    final tokenFcm = await almacen.tokenFcm();
    if (tokenFcm != null && tokenFcm.isNotEmpty) {
      try {
        await tokensRepositorio.revocar(tokenFcm);
      } catch (_) {
        // Ignorar errores: si el token ya no existe en backend o hay red caida,
        // igual procedemos con el cierre de sesion local.
      }
    }
    await servicioNotificaciones.eliminarToken();

    final tokenRefresco = await almacen.tokenRefresco();
    if (tokenRefresco != null) {
      try {
        await repositorio.cerrarSesion(tokenRefresco);
      } catch (_) {
        // Ignorar errores de red al cerrar sesion.
      }
    }
    // Cierra ademas la sesion local de Google para que la proxima vez
    // muestre el selector de cuentas. No bloquea si Google no estaba activo.
    await googleSignIn.cerrarSesion();
    await almacen.limpiar();
    state = AutenticacionEstado(inicializado: true);
  }

  Future<void> _sincronizarTokenPush() async {
    if (state.usuario == null) return;
    try {
      await servicioNotificaciones.inicializar();
      final token = await servicioNotificaciones.obtenerToken();
      if (token == null || token.isEmpty) return;

      final guardado = await almacen.tokenFcm();
      if (guardado != token) {
        await tokensRepositorio.registrar(token);
        await almacen.guardarTokenFcm(token);
      }

      servicioNotificaciones.escucharRefresco((nuevo) async {
        try {
          await tokensRepositorio.registrar(nuevo);
          await almacen.guardarTokenFcm(nuevo);
        } catch (e) {
          if (kDebugMode) {
            debugPrint('[FCM] error al re-registrar token: $e');
          }
        }
      });
    } catch (e) {
      if (kDebugMode) debugPrint('[FCM] error al sincronizar token: $e');
    }
  }

  String _formatearError(Object error) {
    final mensaje = error.toString();
    if (mensaje.contains('429')) {
      return 'Demasiadas solicitudes. Intenta en unos minutos.';
    }
    if (mensaje.contains('bloqueado')) {
      return 'Demasiados intentos. Solicita un código nuevo.';
    }
    if (mensaje.contains('Código inválido') ||
        mensaje.contains('expirado')) {
      return 'Código inválido o expirado';
    }
    if (mensaje.contains('401')) return 'Credenciales invalidas';
    if (mensaje.contains('409')) return 'El usuario ya existe';
    if (mensaje.contains('PEDIDO_ZONA_INVALIDA')) {
      return 'La ubicacion seleccionada esta fuera de zona de cobertura';
    }
    return 'No fue posible completar la operacion. Intenta de nuevo.';
  }
}

final autenticacionControladorProvider =
    StateNotifierProvider<AutenticacionControlador, AutenticacionEstado>(
  (ref) {
    return AutenticacionControlador(
      repositorio: ref.watch(autenticacionRepositorioProvider),
      usuariosRepositorio: ref.watch(usuariosRepositorioProvider),
      almacen: ref.watch(almacenamientoSeguroProvider),
      servicioNotificaciones: ref.watch(servicioNotificacionesProvider),
      tokensRepositorio: ref.watch(tokensDispositivoRepositorioProvider),
      googleSignIn: ref.watch(googleSignInServicioProvider),
    );
  },
);
