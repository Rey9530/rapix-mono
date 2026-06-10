import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../nucleo/tema/tokens_rapix.dart';
import '../../widgets/wordmark_rapix.dart';

const _idAplicacion = 'com.rapixapp';

/// Pantalla bloqueante que se muestra cuando la versión instalada es menor
/// que la mínima requerida por el backend. No se puede cerrar con back; la
/// única salida es actualizar desde Play Store.
class ActualizacionRequeridaPantalla extends StatelessWidget {
  const ActualizacionRequeridaPantalla({super.key});

  Future<void> _abrirTienda(BuildContext context) async {
    // Intentar abrir la app de Play Store directamente; si el dispositivo
    // no la tiene, caer a la URL web.
    final market = Uri.parse('market://details?id=$_idAplicacion');
    final web = Uri.parse(
      'https://play.google.com/store/apps/details?id=$_idAplicacion',
    );
    final abierto = await launchUrl(
      market,
      mode: LaunchMode.externalApplication,
    ).catchError((_) => false);
    if (abierto) return;
    final abiertoWeb = await launchUrl(
      web,
      mode: LaunchMode.externalApplication,
    ).catchError((_) => false);
    if (!abiertoWeb && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No se pudo abrir Play Store')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: t.fondo,
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const WordmarkRapix(tamano: 48),
                  const SizedBox(height: 40),
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: tokens(context).verdeSuave,
                      borderRadius: BorderRadius.circular(
                        TokensRapix.radioPill,
                      ),
                    ),
                    child: const Icon(
                      Icons.system_update,
                      color: TokensRapix.verdeOscuro,
                      size: 36,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Actualización requerida',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: t.tinta,
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Hay una nueva versión de Rapix con mejoras importantes. '
                    'Actualiza la app para seguir usándola.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: t.tintaSilenciada,
                        ),
                  ),
                  const SizedBox(height: 28),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.icon(
                      onPressed: () => _abrirTienda(context),
                      icon: const Icon(Icons.shop_outlined),
                      label: const Text('Actualizar'),
                      style: FilledButton.styleFrom(
                        backgroundColor: TokensRapix.verde,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            TokensRapix.radioMd,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
