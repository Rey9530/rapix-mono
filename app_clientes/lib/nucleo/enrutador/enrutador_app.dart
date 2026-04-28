import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../caracteristicas/autenticacion/autenticacion_controlador.dart';
import '../../caracteristicas/autenticacion/iniciar_sesion_pantalla.dart';
import '../../caracteristicas/autenticacion/registrar_pantalla.dart';
import '../../caracteristicas/autenticacion/selector_ubicacion_pantalla.dart';
import '../../caracteristicas/inicio/inicio_pantalla.dart';
import '../../caracteristicas/paquetes/mis_paquetes_pantalla.dart';
import '../../caracteristicas/paquetes/paquetes_tienda_pantalla.dart';
import '../../caracteristicas/pedidos/crear_pedido_pantalla.dart';
import '../../caracteristicas/pedidos/pedido_detalle_pantalla.dart';
import '../../caracteristicas/pedidos/pedidos_listado_pantalla.dart';
import '../../caracteristicas/seguimiento/seguimiento_pantalla.dart';

final enrutadorAppProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: _NotifierAuth(ref),
    redirect: (context, state) {
      final auth = ref.read(autenticacionControladorProvider);
      if (!auth.inicializado) return null;

      final ruta = state.matchedLocation;
      final esPublica = ruta.startsWith('/iniciar-sesion') ||
          ruta.startsWith('/registrar') ||
          ruta.startsWith('/seguimiento/');

      if (!auth.autenticado && !esPublica) {
        return '/iniciar-sesion';
      }
      if (auth.autenticado &&
          (ruta == '/iniciar-sesion' || ruta == '/registrar')) {
        return '/';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/iniciar-sesion',
        builder: (_, _) => const IniciarSesionPantalla(),
      ),
      GoRoute(
        path: '/registrar',
        builder: (_, _) => const RegistrarPantalla(),
      ),
      GoRoute(
        path: '/seleccionar-ubicacion',
        builder: (_, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return SelectorUbicacionPantalla(
            titulo: extra?['titulo'] as String? ?? 'Seleccionar ubicacion',
            inicial: extra?['inicial'] as mb.Point?,
          );
        },
      ),
      GoRoute(
        path: '/seguimiento/:codigo',
        builder: (_, state) =>
            SeguimientoPantalla(codigo: state.pathParameters['codigo']!),
      ),
      GoRoute(
        path: '/',
        builder: (_, _) => const InicioPantalla(),
        routes: [
          GoRoute(
            path: 'pedidos',
            builder: (_, _) => const PedidosListadoPantalla(),
            routes: [
              GoRoute(
                path: 'nuevo',
                builder: (_, _) => const CrearPedidoPantalla(),
              ),
              GoRoute(
                path: ':id',
                builder: (_, state) => PedidoDetallePantalla(
                  pedidoId: state.pathParameters['id']!,
                ),
              ),
            ],
          ),
          GoRoute(
            path: 'paquetes',
            builder: (_, _) => const MisPaquetesPantalla(),
            routes: [
              GoRoute(
                path: 'tienda',
                builder: (_, _) => const PaquetesTiendaPantalla(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});

class _NotifierAuth extends ChangeNotifier {
  _NotifierAuth(this.ref) {
    ref.listen(autenticacionControladorProvider, (anterior, actual) {
      if (anterior?.autenticado != actual.autenticado ||
          anterior?.inicializado != actual.inicializado) {
        notifyListeners();
      }
    });
  }

  final Ref ref;
}
