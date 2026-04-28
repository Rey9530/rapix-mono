import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../datos/modelos/pedido.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';

class FiltrosListado {
  FiltrosListado({this.estado, this.desde, this.hasta});

  final String? estado;
  final DateTime? desde;
  final DateTime? hasta;

  FiltrosListadoPedidos a() => FiltrosListadoPedidos(
        estado: estado,
        desde: desde,
        hasta: hasta,
      );

  FiltrosListado copia({
    String? estado,
    DateTime? desde,
    DateTime? hasta,
    bool limpiarEstado = false,
    bool limpiarDesde = false,
    bool limpiarHasta = false,
  }) {
    return FiltrosListado(
      estado: limpiarEstado ? null : (estado ?? this.estado),
      desde: limpiarDesde ? null : (desde ?? this.desde),
      hasta: limpiarHasta ? null : (hasta ?? this.hasta),
    );
  }
}

final filtrosPedidosProvider =
    StateProvider<FiltrosListado>((ref) => FiltrosListado());

final pedidosListadoProvider =
    FutureProvider.autoDispose<List<Pedido>>((ref) async {
  final repo = ref.watch(pedidosRepositorioProvider);
  final filtros = ref.watch(filtrosPedidosProvider);
  return repo.listarMios(filtros: filtros.a());
});

final pedidoDetalleProvider =
    FutureProvider.family.autoDispose<Pedido, String>((ref, id) async {
  final repo = ref.watch(pedidosRepositorioProvider);
  return repo.obtenerPorId(id);
});
