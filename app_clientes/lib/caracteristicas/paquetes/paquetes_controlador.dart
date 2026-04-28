import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../datos/modelos/paquete_recargado.dart';
import '../../datos/repositorios/paquetes_repositorio.dart';

final paquetesDisponiblesProvider =
    FutureProvider.autoDispose<List<ReglaTarifaPaquete>>((ref) async {
  return ref.watch(paquetesRepositorioProvider).disponibles();
});

final misPaquetesProvider =
    FutureProvider.autoDispose<List<PaqueteRecargado>>((ref) async {
  return ref.watch(paquetesRepositorioProvider).misPaquetes();
});

final saldoProvider = FutureProvider.autoDispose<SaldoPaquetes>((ref) async {
  return ref.watch(paquetesRepositorioProvider).saldo();
});
