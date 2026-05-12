import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'nucleo/enrutador/enrutador_app.dart';
import 'nucleo/tema/proveedor_tema.dart';
import 'nucleo/tema/tema_app.dart';

class AppClientes extends ConsumerWidget {
  const AppClientes({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enrutador = ref.watch(enrutadorAppProvider);
    final modoTema = ref.watch(temaControladorProvider);
    return MaterialApp.router(
      title: 'Delivery Vendedor',
      theme: TemaApp.claro(),
      darkTheme: TemaApp.oscuro(),
      themeMode: modoTema,
      debugShowCheckedModeBanner: false,
      routerConfig: enrutador,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [Locale('es'), Locale('en')],
      locale: const Locale('es'),
    );
  }
}
