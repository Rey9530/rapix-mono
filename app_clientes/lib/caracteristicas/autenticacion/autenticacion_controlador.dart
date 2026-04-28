import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../datos/modelos/usuario.dart';
import '../../datos/repositorios/autenticacion_repositorio.dart';
import '../../nucleo/almacenamiento/almacenamiento_seguro.dart';

class AutenticacionEstado {
  AutenticacionEstado({
    this.usuario,
    this.cargando = false,
    this.inicializado = false,
    this.error,
  });

  final Usuario? usuario;
  final bool cargando;
  final bool inicializado;
  final String? error;

  bool get autenticado => usuario != null;

  AutenticacionEstado copia({
    Usuario? usuario,
    bool? cargando,
    bool? inicializado,
    String? error,
    bool limpiarUsuario = false,
    bool limpiarError = false,
  }) {
    return AutenticacionEstado(
      usuario: limpiarUsuario ? null : (usuario ?? this.usuario),
      cargando: cargando ?? this.cargando,
      inicializado: inicializado ?? this.inicializado,
      error: limpiarError ? null : (error ?? this.error),
    );
  }
}

class AutenticacionControlador extends StateNotifier<AutenticacionEstado> {
  AutenticacionControlador({
    required this.repositorio,
    required this.almacen,
  }) : super(AutenticacionEstado()) {
    _cargarSesion();
  }

  final AutenticacionRepositorio repositorio;
  final AlmacenamientoSeguro almacen;

  Future<void> _cargarSesion() async {
    final usuarioGuardado = Usuario.desdeJsonString(await almacen.usuario());
    state = state.copia(
      usuario: usuarioGuardado,
      inicializado: true,
    );
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

  Future<void> cerrarSesion() async {
    final tokenRefresco = await almacen.tokenRefresco();
    if (tokenRefresco != null) {
      try {
        await repositorio.cerrarSesion(tokenRefresco);
      } catch (_) {
        // Ignorar errores de red al cerrar sesion.
      }
    }
    await almacen.limpiar();
    state = AutenticacionEstado(inicializado: true);
  }

  String _formatearError(Object error) {
    final mensaje = error.toString();
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
      almacen: ref.watch(almacenamientoSeguroProvider),
    );
  },
);
