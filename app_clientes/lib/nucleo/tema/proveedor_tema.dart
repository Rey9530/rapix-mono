import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../almacenamiento/almacenamiento_seguro.dart';

/// Controlador del modo de tema (claro/oscuro) con persistencia.
///
/// Default: [ThemeMode.light]. Si el usuario cambia el modo, la decision se
/// guarda en [AlmacenamientoSeguro] y se restaura al reabrir la app.
class TemaControlador extends StateNotifier<ThemeMode> {
  TemaControlador(this._almacen) : super(ThemeMode.light) {
    _cargar();
  }

  final AlmacenamientoSeguro _almacen;

  static const _modoOscuro = 'oscuro';
  static const _modoClaro = 'claro';

  Future<void> _cargar() async {
    final guardado = await _almacen.tema();
    if (guardado == _modoOscuro) {
      state = ThemeMode.dark;
    } else if (guardado == _modoClaro) {
      state = ThemeMode.light;
    }
  }

  Future<void> cambiar(ThemeMode modo) async {
    if (state == modo) return;
    state = modo;
    await _almacen.guardarTema(
      modo == ThemeMode.dark ? _modoOscuro : _modoClaro,
    );
  }

  Future<void> alternar() =>
      cambiar(state == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark);
}

final temaControladorProvider =
    StateNotifierProvider<TemaControlador, ThemeMode>((ref) {
      return TemaControlador(ref.watch(almacenamientoSeguroProvider));
    });
