import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../autenticacion/controlador_autenticacion.dart';

class PantallaInicio extends ConsumerWidget {
  final Widget child;

  const PantallaInicio({super.key, required this.child});

  static const _rutas = <String>[
    '/inicio/recogidas',
    '/inicio/en-curso',
    '/inicio/entregas',
    '/inicio/mapa',
    '/inicio/cierre',
  ];

  int _indiceActual(String location) {
    if (location.startsWith('/inicio/en-curso')) return 1;
    if (location.startsWith('/inicio/entregas')) return 2;
    if (location.startsWith('/inicio/mapa')) return 3;
    if (location.startsWith('/inicio/cierre')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).matchedLocation;
    final indice = _indiceActual(location);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Rapix Repartidor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Cerrar sesión',
            onPressed: () async {
              await ref.read(controladorAutenticacionProveedor.notifier).cerrarSesion();
            },
          ),
        ],
      ),
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: indice,
        onDestinationSelected: (i) => context.go(_rutas[i]),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.archive_outlined), label: 'Recoger'),
          NavigationDestination(icon: Icon(Icons.directions_bike_outlined), label: 'En curso'),
          NavigationDestination(icon: Icon(Icons.local_shipping_outlined), label: 'Entregar'),
          NavigationDestination(icon: Icon(Icons.map_outlined), label: 'Mapa'),
          NavigationDestination(icon: Icon(Icons.point_of_sale_outlined), label: 'Cierre'),
        ],
      ),
    );
  }
}
