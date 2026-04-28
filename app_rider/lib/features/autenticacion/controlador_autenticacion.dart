import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/usuario.dart';
import '../../servicios/servicio_push.dart';

final controladorAutenticacionProveedor =
    AsyncNotifierProvider<ControladorAutenticacion, Usuario?>(
  ControladorAutenticacion.new,
);

class ControladorAutenticacion extends AsyncNotifier<Usuario?> {
  @override
  Future<Usuario?> build() async {
    final repo = ref.read(autenticacionRepositorioProveedor);
    final usuario = await repo.obtenerPerfil();
    if (usuario != null) {
      // Inicializa push de forma silenciosa.
      unawaited(_iniciarPush());
    }
    return usuario;
  }

  Future<void> iniciarSesion({
    required String email,
    required String contrasena,
  }) async {
    state = const AsyncValue.loading();
    final repo = ref.read(autenticacionRepositorioProveedor);
    state = await AsyncValue.guard(() async {
      final r = await repo.iniciarSesion(email: email, contrasena: contrasena);
      unawaited(_iniciarPush());
      return r.usuario;
    });
  }

  Future<void> cerrarSesion() async {
    final repo = ref.read(autenticacionRepositorioProveedor);
    await repo.cerrarSesion();
    state = const AsyncValue.data(null);
  }

  Future<void> _iniciarPush() async {
    try {
      final servicio = ServicioPush(
        repositorio: ref.read(tokensDispositivoRepositorioProveedor),
      );
      await servicio.iniciar();
    } catch (_) {
      // FCM puede no estar configurado: no bloquea el login.
    }
  }
}

void unawaited(Future<void> _) {}
