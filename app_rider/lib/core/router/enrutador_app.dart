import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/modelos/usuario.dart';
import '../../features/autenticacion/controlador_autenticacion.dart';
import '../proveedores_globales.dart';
import '../../features/autenticacion/pantalla_inicio_sesion.dart';
import '../../features/billetera/pantalla_billetera.dart';
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
import '../../features/splash/pantalla_splash.dart';

final enrutadorAppProveedor = Provider<GoRouter>((ref) {
  final servicioPush = ref.watch(servicioPushProveedor);
  late final GoRouter enrutador;

  void atenderDeepLink() {
    final ruta = servicioPush.deepLinkPendiente.value;
    if (ruta == null || ruta.isEmpty) return;
    final auth = ref.read(controladorAutenticacionProveedor);
    final estaAutenticado = auth.maybeWhen(
      data: (usuario) => usuario != null,
      orElse: () => false,
    );
    if (!estaAutenticado) return;
    enrutador.go(ruta);
    servicioPush.deepLinkPendiente.value = null;
  }

  servicioPush.deepLinkPendiente.addListener(atenderDeepLink);
  ref.onDispose(
    () => servicioPush.deepLinkPendiente.removeListener(atenderDeepLink),
  );

  enrutador = GoRouter(
    initialLocation: '/splash',
    refreshListenable: _NotifierAuth(ref),
    redirect: (context, state) {
      final auth = ref.read(controladorAutenticacionProveedor);
      final ruta = state.matchedLocation;

      // Hasta que el AsyncNotifier termine su build (o caiga en error),
      // mantenemos al usuario en /splash. La splash decide a donde ir
      // cuando el estado se asiente.
      final inicializado = auth is AsyncData<Usuario?>;
      if (!inicializado) {
        return ruta == '/splash' ? null : '/splash';
      }

      final estaAutenticado = auth.value != null;
      final esPublica = ruta == '/splash' || ruta == '/login';

      if (!estaAutenticado && !esPublica) return '/login';
      if (estaAutenticado && (ruta == '/login' || ruta == '/splash')) {
        return '/inicio/recogidas';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const PantallaSplash(),
      ),
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
          GoRoute(
            path: '/inicio/billetera',
            builder: (context, state) => const PantallaBilletera(),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(child: Text('Ruta no encontrada: ${state.matchedLocation}')),
    ),
  );

  return enrutador;
});

/// Listenable que dispara la re-evaluacion del `redirect` del GoRouter cuando
/// cambia la autenticacion (de loading a data, o de autenticado a no
/// autenticado tras un logout/sesion expirada). Evita reconstruir todo el
/// router en cada tick.
class _NotifierAuth extends ChangeNotifier {
  _NotifierAuth(this.ref) {
    ref.listen<AsyncValue<Usuario?>>(controladorAutenticacionProveedor,
        (anterior, actual) {
      final antesAuth = anterior?.valueOrNull != null;
      final ahoraAuth = actual.valueOrNull != null;
      final antesInit = anterior is AsyncData<Usuario?>;
      final ahoraInit = actual is AsyncData<Usuario?>;
      if (antesAuth != ahoraAuth || antesInit != ahoraInit) {
        notifyListeners();
      }
    });
  }

  final Ref ref;
}
