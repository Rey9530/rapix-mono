import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'widgets/vista_lista_recogidas.dart';
import 'widgets/vista_mapa_recogidas.dart';

/// Pantalla de recogidas. Hospeda un `TabBar` con dos pestañas:
/// 1. "Listado": contenido idéntico al histórico (agrupado por tienda,
///    botón "Avísale que estoy aquí", navegación al detalle).
/// 2. "Ruta": mapa con la ruta óptima (vecino más cercano) hacia las
///    tiendas pendientes, con navegación por GPS y avance automático al
///    entrar en el radio de geofencing de cada tienda.
class PantallaListaRecogidas extends ConsumerStatefulWidget {
  const PantallaListaRecogidas({super.key});

  @override
  ConsumerState<PantallaListaRecogidas> createState() =>
      _PantallaListaRecogidasEstado();
}

class _PantallaListaRecogidasEstado
    extends ConsumerState<PantallaListaRecogidas>
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
              VistaListaRecogidas(),
              VistaMapaRecogidas(),
            ],
          ),
        ),
      ],
    );
  }
}