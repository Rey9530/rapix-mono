import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/proveedores_globales.dart';
import 'core/router/enrutador_app.dart';
import 'core/theme/tema_app.dart';

class AppRepartidor extends ConsumerWidget {
  const AppRepartidor({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Re-construye el router cuando la sesión expira: invalidar
    // el provider obliga al GoRouter a re-evaluar el redirect.
    ref.listen<int>(sesionExpiradaProveedor, (prev, next) {
      ref.invalidate(enrutadorAppProveedor);
    });

    final router = ref.watch(enrutadorAppProveedor);

    return MaterialApp.router(
      title: 'Rapix Repartidor',
      debugShowCheckedModeBanner: false,
      theme: TemaApp.claro(),
      routerConfig: router,
    );
  }
}
