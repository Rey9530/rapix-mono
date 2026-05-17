import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../datos/modelos/deposito.dart';
import '../../datos/repositorios/cobros_repositorio.dart';

final saldoPendienteProvider =
    FutureProvider.autoDispose<SaldoPendiente>((ref) async {
  return ref.watch(cobrosRepositorioProvider).saldoPendiente();
});

final historialDepositosProvider =
    FutureProvider.autoDispose<PaginaDepositos>((ref) async {
  return ref.watch(cobrosRepositorioProvider).historial();
});

final depositoDetalleProvider = FutureProvider.autoDispose
    .family<DepositoDetalle, String>((ref, depositoId) async {
  return ref.watch(cobrosRepositorioProvider).detalleDeposito(depositoId);
});
