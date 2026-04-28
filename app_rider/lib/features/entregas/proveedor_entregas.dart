import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';

final entregasPendientesProveedor = FutureProvider<List<Pedido>>((ref) async {
  return ref.read(pedidosRepositorioProveedor).entregasPendientes();
});
