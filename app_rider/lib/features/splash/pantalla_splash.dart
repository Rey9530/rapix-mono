import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/modelos/usuario.dart';
import '../autenticacion/controlador_autenticacion.dart';

/// Pantalla inicial al abrir la app: mientras [ControladorAutenticacion.build]
/// resuelve la sesion guardada (cache + refresh en segundo plano), se muestra
/// el wordmark con un loader. Cuando el estado se asienta, navega a
/// `/inicio/recogidas` o `/login`. Si el AsyncNotifier cae en error (tipico
/// de red caida en una primera ejecucion sin cache), muestra una vista de
/// "Sin conexion" con boton para reintentar.
class PantallaSplash extends ConsumerStatefulWidget {
  const PantallaSplash({super.key});

  @override
  ConsumerState<PantallaSplash> createState() => _PantallaSplashEstado();
}

class _PantallaSplashEstado extends ConsumerState<PantallaSplash> {
  bool _errorRed = false;

  void _reintentar() {
    setState(() => _errorRed = false);
    ref.invalidate(controladorAutenticacionProveedor);
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AsyncValue<Usuario?>>(controladorAutenticacionProveedor,
        (anterior, actual) {
      actual.when(
        data: (usuario) {
          if (!mounted) return;
          if (usuario != null) {
            context.go('/inicio/recogidas');
          } else {
            context.go('/login');
          }
        },
        loading: () {},
        error: (_, _) {
          if (!mounted) return;
          setState(() => _errorRed = true);
        },
      );
    });

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: _errorRed
                ? _VistaError(onReintentar: _reintentar)
                : const _VistaCargando(),
          ),
        ),
      ),
    );
  }
}

class _VistaCargando extends StatelessWidget {
  const _VistaCargando();

  @override
  Widget build(BuildContext context) {
    return const Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        _Wordmark(tamano: 48),
        SizedBox(height: 32),
        SizedBox(
          width: 28,
          height: 28,
          child: CircularProgressIndicator(strokeWidth: 2.5),
        ),
      ],
    );
  }
}

class _VistaError extends StatelessWidget {
  const _VistaError({required this.onReintentar});

  final VoidCallback onReintentar;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const _Wordmark(tamano: 40),
        const SizedBox(height: 40),
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: scheme.errorContainer,
            shape: BoxShape.circle,
          ),
          child: Icon(
            Icons.cloud_off_outlined,
            color: scheme.error,
            size: 36,
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'Sin conexion',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 8),
        Text(
          'No se pudo conectar al servidor. Verifica tu conexion a internet e intenta de nuevo.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: scheme.onSurfaceVariant,
              ),
        ),
        const SizedBox(height: 28),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: onReintentar,
            icon: const Icon(Icons.refresh),
            label: const Text('Reintentar'),
          ),
        ),
      ],
    );
  }
}

class _Wordmark extends StatelessWidget {
  const _Wordmark({required this.tamano});

  final double tamano;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(
            text: 'Rapix',
            style: TextStyle(
              fontSize: tamano,
              fontWeight: FontWeight.w800,
              letterSpacing: -1,
              color: scheme.onSurface,
              height: 1,
            ),
          ),
          TextSpan(
            text: ' Repartidor',
            style: TextStyle(
              fontSize: tamano * 0.5,
              fontWeight: FontWeight.w600,
              letterSpacing: 0,
              color: scheme.primary,
              height: 1,
            ),
          ),
        ],
      ),
    );
  }
}
