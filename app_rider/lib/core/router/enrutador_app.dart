import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/autenticacion/controlador_autenticacion.dart';
import '../../features/autenticacion/pantalla_inicio_sesion.dart';
import '../../features/cierre/pantalla_cierre_diario.dart';
import '../../features/en_curso/pantalla_lista_en_curso.dart';
import '../../features/entregas/pantalla_comprobante_entrega.dart';
import '../../features/entregas/pantalla_detalle_entrega.dart';
import '../../features/entregas/pantalla_lista_entregas.dart';
import '../../features/inicio/pantalla_inicio.dart';
import '../../features/mapa/pantalla_mapa_punto.dart';
import '../../features/mapa/pantalla_mapa_ruta.dart';
import '../../features/recogidas/pantalla_detalle_recogida.dart';
import '../../features/recogidas/pantalla_lista_recogidas.dart';

final enrutadorAppProveedor = Provider<GoRouter>((ref) {
  final auth = ref.watch(controladorAutenticacionProveedor);

  return GoRouter(
    initialLocation: '/inicio/recogidas',
    redirect: (context, state) {
      final autenticando = state.matchedLocation == '/login';
      final estaAutenticado = auth.maybeWhen(
        data: (usuario) => usuario != null,
        orElse: () => false,
      );

      if (!estaAutenticado && !autenticando) return '/login';
      if (estaAutenticado && autenticando) return '/inicio/recogidas';
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const PantallaInicioSesion(),
      ),
      ShellRoute(
        builder: (context, state, child) => PantallaInicio(child: child),
        routes: [
          GoRoute(
            path: '/inicio/recogidas',
            builder: (context, state) => const PantallaListaRecogidas(),
            routes: [
              GoRoute(
                path: ':pedidoId',
                builder: (context, state) => PantallaDetalleRecogida(
                  pedidoId: state.pathParameters['pedidoId']!,
                ),
                routes: [
                  GoRoute(
                    path: 'mapa',
                    builder: (context, state) => PantallaMapaPunto(
                      pedidoId: state.pathParameters['pedidoId']!,
                      tipo: state.uri.queryParameters['tipo'] ?? 'origen',
                    ),
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            path: '/inicio/en-curso',
            builder: (context, state) => const PantallaListaEnCurso(),
            routes: [
              GoRoute(
                path: ':pedidoId',
                builder: (context, state) => PantallaDetalleRecogida(
                  pedidoId: state.pathParameters['pedidoId']!,
                ),
                routes: [
                  GoRoute(
                    path: 'mapa',
                    builder: (context, state) => PantallaMapaPunto(
                      pedidoId: state.pathParameters['pedidoId']!,
                      tipo: state.uri.queryParameters['tipo'] ?? 'destino',
                    ),
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            path: '/inicio/entregas',
            builder: (context, state) => const PantallaListaEntregas(),
            routes: [
              GoRoute(
                path: ':pedidoId',
                builder: (context, state) => PantallaDetalleEntrega(
                  pedidoId: state.pathParameters['pedidoId']!,
                ),
                routes: [
                  GoRoute(
                    path: 'comprobante',
                    builder: (context, state) => PantallaComprobanteEntrega(
                      pedidoId: state.pathParameters['pedidoId']!,
                    ),
                  ),
                  GoRoute(
                    path: 'mapa',
                    builder: (context, state) => PantallaMapaPunto(
                      pedidoId: state.pathParameters['pedidoId']!,
                      tipo: state.uri.queryParameters['tipo'] ?? 'destino',
                    ),
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            path: '/inicio/mapa',
            builder: (context, state) => const PantallaMapaRuta(),
          ),
          GoRoute(
            path: '/inicio/cierre',
            builder: (context, state) => const PantallaCierreDiario(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('Ruta no encontrada: ${state.matchedLocation}')),
    ),
  );
});
