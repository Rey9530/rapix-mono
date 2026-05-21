import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../caracteristicas/autenticacion/autenticacion_controlador.dart';
import '../notificaciones/servicio_notificaciones.dart';
import '../../caracteristicas/autenticacion/completar_registro_pantalla.dart';
import '../../caracteristicas/autenticacion/confirmar_recuperacion_pantalla.dart';
import '../../caracteristicas/autenticacion/iniciar_sesion_pantalla.dart';
import '../../caracteristicas/autenticacion/recuperar_contrasena_pantalla.dart';
import '../../caracteristicas/autenticacion/registrar_pantalla.dart';
import '../../caracteristicas/autenticacion/selector_ubicacion_pantalla.dart';
import '../../caracteristicas/cobros/cobro_detalle_pantalla.dart';
import '../../caracteristicas/cobros/cobros_pantalla.dart';
import '../../caracteristicas/inicio/inicio_pantalla.dart';
import '../../caracteristicas/paquetes/mis_paquetes_pantalla.dart';
import '../../caracteristicas/paquetes/paquete_compra_exito_pantalla.dart';
import '../../caracteristicas/paquetes/paquetes_tienda_pantalla.dart';
import '../../caracteristicas/paquetes/realizar_compra_paquete_pantalla.dart';
import '../../datos/modelos/paquete_recargado.dart';
import '../../caracteristicas/pedidos/crear_pedido_pantalla.dart';
import '../../caracteristicas/pedidos/mapa_pedido_pantalla.dart';
import '../../caracteristicas/pedidos/pedido_detalle_pantalla.dart';
import '../../caracteristicas/pedidos/pedidos_listado_pantalla.dart';
import '../../caracteristicas/perfil/cuentas_bancarias/formulario_cuenta_bancaria_pantalla.dart';
import '../../caracteristicas/perfil/cuentas_bancarias/lista_cuentas_bancarias_pantalla.dart';
import '../../caracteristicas/perfil/editar_negocio_pantalla.dart';
import '../../caracteristicas/perfil/perfil_pantalla.dart';
import '../../caracteristicas/seguimiento/seguimiento_pantalla.dart';
import '../../caracteristicas/splash/splash_pantalla.dart';
import '../../widgets/esqueleto_navegacion.dart';

final enrutadorAppProvider = Provider<GoRouter>((ref) {
  final servicio = ref.watch(servicioNotificacionesProvider);
  late final GoRouter enrutador;

  void atender() {
    final ruta = servicio.deepLinkPendiente.value;
    if (ruta == null || ruta.isEmpty) return;
    final auth = ref.read(autenticacionControladorProvider);
    if (!auth.autenticado) return;
    // Mientras el registro no este completo, los deep links no deben
    // saltarse el muro de /completar-registro.
    if (!(auth.usuario?.registroCompleto ?? false)) return;
    enrutador.go(ruta);
    servicio.deepLinkPendiente.value = null;
  }

  servicio.deepLinkPendiente.addListener(atender);
  ref.onDispose(() => servicio.deepLinkPendiente.removeListener(atender));

  enrutador = GoRouter(
    initialLocation: '/splash',
    refreshListenable: _NotifierAuth(ref),
    redirect: (context, state) {
      final auth = ref.read(autenticacionControladorProvider);
      final ruta = state.matchedLocation;

      // Mientras no se haya inicializado la sesion, mantener al usuario
      // en /splash (es la unica pantalla preparada para ese estado).
      if (!auth.inicializado) {
        return ruta == '/splash' ? null : '/splash';
      }

      // Muro de registro: si el usuario esta autenticado pero no ha
      // completado los datos obligatorios, forzar /completar-registro.
      // Se evalua ANTES de cualquier otra regla para que el cliente no
      // pueda saltarse el muro navegando por su cuenta.
      // Excepcion: /seleccionar-ubicacion es una sub-pantalla auxiliar
      // que la propia pantalla de completar-registro abre para que el
      // usuario marque la ubicacion del negocio en el mapa.
      if (auth.autenticado &&
          auth.usuario != null &&
          !auth.usuario!.registroCompleto) {
        if (ruta == '/completar-registro' ||
            ruta.startsWith('/seleccionar-ubicacion')) {
          return null;
        }
        return '/completar-registro';
      }

      final esPublica = ruta == '/splash' ||
          ruta.startsWith('/iniciar-sesion') ||
          ruta.startsWith('/registrar') ||
          ruta.startsWith('/recuperar-contrasena') ||
          ruta.startsWith('/seleccionar-ubicacion') ||
          ruta.startsWith('/seguimiento/');

      if (!auth.autenticado && !esPublica) {
        return '/iniciar-sesion';
      }
      if (auth.autenticado &&
          (ruta == '/iniciar-sesion' ||
              ruta == '/registrar' ||
              ruta == '/completar-registro')) {
        return '/inicio';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (_, _) => const SplashPantalla(),
      ),
      GoRoute(
        path: '/iniciar-sesion',
        builder: (_, _) => const IniciarSesionPantalla(),
      ),
      GoRoute(
        path: '/registrar',
        builder: (_, _) => const RegistrarPantalla(),
      ),
      // Fuera del StatefulShellRoute: la pantalla no debe mostrar bottom-nav.
      GoRoute(
        path: '/completar-registro',
        builder: (_, _) => const CompletarRegistroPantalla(),
      ),
      GoRoute(
        path: '/recuperar-contrasena',
        builder: (_, _) => const RecuperarContrasenaPantalla(),
        routes: [
          GoRoute(
            path: 'confirmar',
            builder: (_, state) => ConfirmarRecuperacionPantalla(
              email: state.extra as String? ?? '',
            ),
          ),
        ],
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
      StatefulShellRoute.indexedStack(
        builder: (_, state, shell) => EsqueletoNavegacion(shell: shell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/inicio',
                builder: (_, _) => const InicioPantalla(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/pedidos',
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
                    routes: [
                      GoRoute(
                        path: 'mapa',
                        builder: (_, state) => MapaPedidoPantalla(
                          pedidoId: state.pathParameters['id']!,
                          enfoque: state.uri.queryParameters['enfoque'],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/paquetes',
                builder: (_, _) => const MisPaquetesPantalla(),
                routes: [
                  GoRoute(
                    path: 'tienda',
                    builder: (_, _) => const PaquetesTiendaPantalla(),
                    routes: [
                      GoRoute(
                        path: 'comprar',
                        builder: (_, state) =>
                            RealizarCompraPaquetePantalla(
                          regla: state.extra! as ReglaTarifaPaquete,
                        ),
                      ),
                      GoRoute(
                        path: 'exito',
                        builder: (_, state) => PaqueteCompraExitoPantalla(
                          paquete: state.extra! as PaqueteRecargado,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/cobros',
                builder: (_, _) => const CobrosPantalla(),
                routes: [
                  GoRoute(
                    path: ':depositoId',
                    builder: (_, state) => CobroDetallePantalla(
                      depositoId: state.pathParameters['depositoId']!,
                    ),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/perfil',
                builder: (_, _) => const PerfilPantalla(),
                routes: [
                  GoRoute(
                    path: 'editar-negocio',
                    builder: (_, _) => const EditarNegocioPantalla(),
                  ),
                  GoRoute(
                    path: 'cuentas-bancarias',
                    builder: (_, _) => const ListaCuentasBancariasPantalla(),
                    routes: [
                      GoRoute(
                        path: 'nueva',
                        builder: (_, _) =>
                            const FormularioCuentaBancariaPantalla(),
                      ),
                      GoRoute(
                        path: ':id/editar',
                        builder: (_, state) => FormularioCuentaBancariaPantalla(
                          cuentaId: state.pathParameters['id'],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

  return enrutador;
});

class _NotifierAuth extends ChangeNotifier {
  _NotifierAuth(this.ref) {
    ref.listen(autenticacionControladorProvider, (anterior, actual) {
      if (anterior?.autenticado != actual.autenticado ||
          anterior?.inicializado != actual.inicializado ||
          anterior?.usuario?.registroCompleto !=
              actual.usuario?.registroCompleto) {
        notifyListeners();
      }
    });
  }

  final Ref ref;
}
