import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../caracteristicas/paquetes/saldo_widget.dart';
import '../autenticacion/autenticacion_controlador.dart';

class InicioPantalla extends ConsumerWidget {
  const InicioPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(autenticacionControladorProvider);
    final usuario = estado.usuario;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          usuario?.perfilVendedor?.nombreNegocio ??
              usuario?.nombreCompleto ??
              'Inicio',
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SaldoWidget(),
            const SizedBox(height: 16),
            Text(
              'Acciones rapidas',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            _Tile(
              icono: Icons.add_box_outlined,
              titulo: 'Nuevo pedido',
              subtitulo: 'Crea un envio para tus clientes',
              alTocar: () => context.push('/pedidos/nuevo'),
            ),
            _Tile(
              icono: Icons.shopping_bag_outlined,
              titulo: 'Comprar paquetes',
              subtitulo: 'Recarga envios prepagados',
              alTocar: () => context.push('/paquetes/tienda'),
            ),
          ],
        ),
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({
    required this.icono,
    required this.titulo,
    required this.subtitulo,
    required this.alTocar,
  });

  final IconData icono;
  final String titulo;
  final String subtitulo;
  final VoidCallback alTocar;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor:
              Theme.of(context).colorScheme.primaryContainer,
          child: Icon(
            icono,
            color: Theme.of(context).colorScheme.onPrimaryContainer,
          ),
        ),
        title: Text(titulo),
        subtitle: Text(subtitulo),
        trailing: const Icon(Icons.chevron_right),
        onTap: alTocar,
      ),
    );
  }
}
