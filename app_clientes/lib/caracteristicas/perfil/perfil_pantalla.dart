import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../autenticacion/autenticacion_controlador.dart';

class PerfilPantalla extends ConsumerWidget {
  const PerfilPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(autenticacionControladorProvider);
    final usuario = estado.usuario;

    if (usuario == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final inicial = usuario.nombreCompleto.trim().isNotEmpty
        ? usuario.nombreCompleto.trim()[0].toUpperCase()
        : '?';
    final perfilVendedor = usuario.perfilVendedor;
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Mi perfil')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 44,
                    backgroundColor: colorScheme.primaryContainer,
                    child: Text(
                      inicial,
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: colorScheme.onPrimaryContainer,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    usuario.nombreCompleto,
                    style: Theme.of(context).textTheme.titleLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    usuario.rol,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.email_outlined),
                    title: const Text('Email'),
                    subtitle: Text(usuario.email),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.phone_outlined),
                    title: const Text('Teléfono'),
                    subtitle: Text(usuario.telefono),
                  ),
                ],
              ),
            ),
            if (perfilVendedor != null) ...[
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Negocio',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  TextButton.icon(
                    onPressed: () => context.push('/perfil/editar-negocio'),
                    icon: const Icon(Icons.edit_outlined, size: 18),
                    label: const Text('Editar'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Card(
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          _LogoNegocio(
                            url: perfilVendedor.urlLogo,
                            placeholder:
                                (perfilVendedor.nombreNegocio?.trim().isNotEmpty ??
                                        false)
                                    ? perfilVendedor.nombreNegocio!
                                        .trim()[0]
                                        .toUpperCase()
                                    : '?',
                            colorScheme: colorScheme,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  perfilVendedor.nombreNegocio ?? 'Sin nombre',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                                if (perfilVendedor.rfc != null) ...[
                                  const SizedBox(height: 4),
                                  Text(
                                    'RFC: ${perfilVendedor.rfc}',
                                    style: Theme.of(context).textTheme.bodySmall,
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (perfilVendedor.direccion != null) ...[
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.location_on_outlined),
                        title: const Text('Dirección'),
                        subtitle: Text(perfilVendedor.direccion!),
                      ),
                    ],
                    if (perfilVendedor.latitud != null &&
                        perfilVendedor.longitud != null) ...[
                      const Divider(height: 1),
                      ListTile(
                        leading: const Icon(Icons.map_outlined),
                        title: const Text('Coordenadas'),
                        subtitle: Text(
                          '${perfilVendedor.latitud!.toStringAsFixed(5)}, ${perfilVendedor.longitud!.toStringAsFixed(5)}',
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
            const SizedBox(height: 32),
            FilledButton.tonalIcon(
              onPressed: () async {
                await ref
                    .read(autenticacionControladorProvider.notifier)
                    .cerrarSesion();
                if (context.mounted) context.go('/iniciar-sesion');
              },
              icon: const Icon(Icons.logout),
              label: const Text('Cerrar sesión'),
            ),
          ],
        ),
      ),
    );
  }
}

class _LogoNegocio extends StatelessWidget {
  const _LogoNegocio({
    required this.url,
    required this.placeholder,
    required this.colorScheme,
  });

  final String? url;
  final String placeholder;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    if (url != null && url!.isNotEmpty) {
      return CircleAvatar(
        radius: 32,
        backgroundImage: NetworkImage(url!),
        onBackgroundImageError: (_, _) {},
      );
    }
    return CircleAvatar(
      radius: 32,
      backgroundColor: colorScheme.secondaryContainer,
      child: Text(
        placeholder,
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: colorScheme.onSecondaryContainer,
        ),
      ),
    );
  }
}
