import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/repositorios/autenticacion_repositorio.dart';
import '../data/repositorios/cierres_repositorio.dart';
import '../data/repositorios/mapas_repositorio.dart';
import '../data/repositorios/pedidos_repositorio.dart';
import '../data/repositorios/tokens_dispositivo_repositorio.dart';
import 'network/dio_cliente.dart';
import 'storage/almacenamiento_seguro.dart';

final almacenamientoSeguroProveedor = Provider<AlmacenamientoSeguro>((ref) {
  return AlmacenamientoSeguro();
});

/// Notifica que la sesión expiró (refresh falló). Se observa en el router para redirigir.
final sesionExpiradaProveedor = StateProvider<int>((ref) => 0);

final dioProveedor = Provider<Dio>((ref) {
  final almacenamiento = ref.watch(almacenamientoSeguroProveedor);
  return DioCliente.crear(
    almacenamiento: almacenamiento,
    alSesionExpirada: () async {
      ref.read(sesionExpiradaProveedor.notifier).state++;
    },
  );
});

final autenticacionRepositorioProveedor = Provider<AutenticacionRepositorio>((ref) {
  return AutenticacionRepositorio(
    dio: ref.watch(dioProveedor),
    almacenamiento: ref.watch(almacenamientoSeguroProveedor),
  );
});

final pedidosRepositorioProveedor = Provider<PedidosRepositorio>((ref) {
  return PedidosRepositorio(dio: ref.watch(dioProveedor));
});

final cierresRepositorioProveedor = Provider<CierresRepositorio>((ref) {
  return CierresRepositorio(dio: ref.watch(dioProveedor));
});

final mapasRepositorioProveedor = Provider<MapasRepositorio>((ref) {
  return MapasRepositorio(dio: ref.watch(dioProveedor));
});

final tokensDispositivoRepositorioProveedor = Provider<TokensDispositivoRepositorio>((ref) {
  return TokensDispositivoRepositorio(dio: ref.watch(dioProveedor));
});
