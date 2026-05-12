import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/movimiento_caja.dart';

final movimientosPendientesProveedor =
    FutureProvider.autoDispose<List<MovimientoCaja>>((ref) async {
  final repo = ref.watch(billeteraRepositorioProveedor);
  return repo.pendientes();
});

final saldoPendienteProveedor =
    FutureProvider.autoDispose<SaldoPendiente>((ref) async {
  final repo = ref.watch(billeteraRepositorioProveedor);
  return repo.saldoPendiente();
});
