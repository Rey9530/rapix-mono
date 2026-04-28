import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';

final recogidasPendientesProveedor = FutureProvider<List<Pedido>>((ref) async {
  return ref.read(pedidosRepositorioProveedor).recogidasPendientes();
});

final pedidoPorIdProveedor = FutureProvider.family<Pedido, String>((ref, id) async {
  return ref.read(pedidosRepositorioProveedor).pedidoPorId(id);
});
