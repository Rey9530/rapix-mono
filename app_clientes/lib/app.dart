import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'nucleo/enrutador/enrutador_app.dart';
import 'nucleo/tema/tema_app.dart';

class AppClientes extends ConsumerWidget {
  const AppClientes({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enrutador = ref.watch(enrutadorAppProvider);
    return MaterialApp.router(
      title: 'Delivery Vendedor',
      theme: TemaApp.claro(),
      darkTheme: TemaApp.oscuro(),
      debugShowCheckedModeBanner: false,
      routerConfig: enrutador,
    );
  }
}
