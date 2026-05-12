import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../datos/modelos/cuenta_bancaria.dart';
import '../../../datos/repositorios/cuentas_bancarias_repositorio.dart';

final bancosProvider = FutureProvider.autoDispose<List<Banco>>((ref) async {
  return ref.watch(cuentasBancariasRepositorioProvider).listarBancos();
});

final cuentasBancariasProvider =
    FutureProvider.autoDispose<List<CuentaBancaria>>((ref) async {
  return ref.watch(cuentasBancariasRepositorioProvider).listar();
});

final cuentaBancariaPorIdProvider =
    Provider.autoDispose.family<AsyncValue<CuentaBancaria?>, String>((ref, id) {
  final cuentas = ref.watch(cuentasBancariasProvider);
  return cuentas.when(
    data: (lista) {
      try {
        return AsyncValue.data(lista.firstWhere((c) => c.id == id));
      } catch (_) {
        return const AsyncValue.data(null);
      }
    },
    loading: () => const AsyncValue.loading(),
    error: (e, st) => AsyncValue.error(e, st),
  );
});
