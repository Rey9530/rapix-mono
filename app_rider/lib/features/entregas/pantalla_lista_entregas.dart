import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'widgets/vista_lista_entregas.dart';
import 'widgets/vista_mapa_entregas.dart';

/// Pantalla de entregas. Hospeda un `TabBar` con dos pestañas:
/// 1. "Listado": lista plana de `TarjetaPedido` para los pedidos pendientes
///    del rider, con navegación al detalle (`/inicio/entregas/:id`).
/// 2. "Ruta": mapa Mapbox con los clientes (destino) ordenados por vecino
///    más cercano, conectados con polilínea. Al iniciar la ruta, el rider
///    es geofenceado pasivamente: al entrar al radio de un cliente la parada
///    se marca como visitada y se avanza a la siguiente.
class PantallaListaEntregas extends ConsumerStatefulWidget {
  const PantallaListaEntregas({super.key});

  @override
  ConsumerState<PantallaListaEntregas> createState() =>
      _PantallaListaEntregasEstado();
}

class _PantallaListaEntregasEstado
    extends ConsumerState<PantallaListaEntregas>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Material(
          color: Theme.of(context).colorScheme.surface,
          child: TabBar(
            controller: _tabController,
            tabs: const [
              Tab(icon: Icon(Icons.list_alt), text: 'Listado'),
              Tab(icon: Icon(Icons.alt_route), text: 'Ruta'),
            ],
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            // Solo cambia de tab con tap explícito; desactiva el swipe
            // horizontal del `TabBarView` para que el gesto del rider sobre
            // el mapa no se confunda con un cambio de pestaña.
            physics: const NeverScrollableScrollPhysics(),
            children: const [
              VistaListaEntregas(),
              VistaMapaEntregas(),
            ],
          ),
        ),
      ],
    );
  }
}