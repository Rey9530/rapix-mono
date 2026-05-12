import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../nucleo/tema/tokens_rapix.dart';
import '../../widgets/wordmark_rapix.dart';
import '../autenticacion/autenticacion_controlador.dart';

/// Pantalla inicial al abrir la app: muestra el wordmark mientras
/// [AutenticacionControlador.inicializarSesion] valida la sesion contra
/// el backend (refresca el token si hay sesion guardada). Cuando termina,
/// navega a /inicio o /iniciar-sesion segun corresponda. Si el refresh
/// falla por red, muestra una vista de error con boton de reintentar.
class SplashPantalla extends ConsumerStatefulWidget {
  const SplashPantalla({super.key});

  @override
  ConsumerState<SplashPantalla> createState() => _SplashPantallaState();
}

class _SplashPantallaState extends ConsumerState<SplashPantalla> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(autenticacionControladorProvider.notifier).inicializarSesion();
    });
  }

  void _reintentar() {
    ref.read(autenticacionControladorProvider.notifier).inicializarSesion();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AutenticacionEstado>(autenticacionControladorProvider,
        (anterior, actual) {
      if (!actual.inicializado || actual.cargando || actual.errorRed) return;
      if (actual.autenticado) {
        context.go('/inicio');
      } else {
        context.go('/iniciar-sesion');
      }
    });

    final estado = ref.watch(autenticacionControladorProvider);
    final t = tokens(context);

    return Scaffold(
      backgroundColor: t.fondo,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: estado.errorRed
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
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: const [
        WordmarkRapix(tamano: 56),
        SizedBox(height: 32),
        SizedBox(
          width: 28,
          height: 28,
          child: CircularProgressIndicator(
            strokeWidth: 2.5,
            valueColor: AlwaysStoppedAnimation(TokensRapix.verde),
          ),
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
    final t = tokens(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const WordmarkRapix(tamano: 48),
        const SizedBox(height: 40),
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            color: TokensRapix.peligroSuave,
            borderRadius: BorderRadius.circular(TokensRapix.radioPill),
          ),
          child: const Icon(
            Icons.cloud_off_outlined,
            color: TokensRapix.peligro,
            size: 36,
          ),
        ),
        const SizedBox(height: 20),
        Text(
          'Sin conexion',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: t.tinta,
                fontWeight: FontWeight.w700,
              ),
        ),
        const SizedBox(height: 8),
        Text(
          'No se pudo conectar al servidor. Verifica tu conexion a internet e intenta de nuevo.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: t.tintaSilenciada,
              ),
        ),
        const SizedBox(height: 28),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: onReintentar,
            icon: const Icon(Icons.refresh),
            label: const Text('Reintentar'),
            style: FilledButton.styleFrom(
              backgroundColor: TokensRapix.verde,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
