import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';

final recogidasPendientesProveedor = FutureProvider<List<Pedido>>((ref) async {
  return ref.read(pedidosRepositorioProveedor).recogidasPendientes();
});

final pedidoPorIdProveedor = FutureProvider.family<Pedido, String>((ref, id) async {
  return ref.read(pedidosRepositorioProveedor).pedidoPorId(id);
});

/// Bloqueo anti-doble-tap en UI para el aviso "rider en tienda".
/// Clave: `vendedorId`. Valor: instante del último aviso enviado.
/// Se considera "reciente" durante [ventanaBloqueo].
const Duration ventanaBloqueo = Duration(minutes: 5);

final avisosEnviadosPorVendedor =
    StateProvider<Map<String, DateTime>>((ref) => <String, DateTime>{});

bool vendedorEnCooldown(Map<String, DateTime> avisos, String vendedorId) {
  final ultimo = avisos[vendedorId];
  if (ultimo == null) return false;
  return DateTime.now().difference(ultimo) < ventanaBloqueo;
}
