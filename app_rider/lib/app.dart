import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/proveedores_globales.dart';
import 'core/router/enrutador_app.dart';
import 'core/theme/tema_app.dart';
import 'features/autenticacion/controlador_autenticacion.dart';

class AppRepartidor extends ConsumerWidget {
  const AppRepartidor({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Cuando el interceptor detecta sesion expirada (refresh fallido),
    // marcamos el estado del controlador como `null` para que el
    // refreshListenable del router redirija a /login automaticamente.
    ref.listen<int>(sesionExpiradaProveedor, (prev, next) {
      ref.read(controladorAutenticacionProveedor.notifier).marcarSesionExpirada();
    });

    final router = ref.watch(enrutadorAppProveedor);

    return MaterialApp.router(
      title: 'Rapix Rider',
      debugShowCheckedModeBanner: false,
      theme: TemaApp.claro(),
      routerConfig: router,
    );
  }
}
