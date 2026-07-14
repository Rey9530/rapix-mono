import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';

import '../../../core/network/excepciones_api.dart';
import '../../../core/proveedores_globales.dart';
import '../../../data/modelos/pedido.dart';
import '../../../widgets/boton_con_carga.dart';
import '../../../widgets/tarjeta_pedido.dart';
import '../proveedor_recogidas.dart';

/// Contenido del tab "Listado". Mantiene intacta la lógica original que vivía
/// en `PantallaListaRecogidas` antes de añadir el TabBar.
class VistaListaRecogidas extends ConsumerWidget {
  const VistaListaRecogidas({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asincrono = ref.watch(recogidasPendientesProveedor);

    return RefreshIndicator(
      onRefresh: () async {
        try {
          final future = ref.refresh(recogidasPendientesProveedor.future);
          await future;
        } catch (_) {
          // Si el refresh falla, el bloque `error:` del `.when` muestra feedback.
        }
      },
      child: asincrono.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ListView(
          children: [
            const SizedBox(height: 200),
            Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Icon(Icons.error_outline,
                        size: 56, color: Theme.of(context).colorScheme.error),
                    const SizedBox(height: 16),
                    Text('Error: $e', textAlign: TextAlign.center),
                    const SizedBox(height: 12),
                    BotonConCarga(
                      variante: VarianteBoton.tonal,
                      onPressed: () async {
                        ref.invalidate(recogidasPendientesProveedor);
                      },
                      estilo: FilledButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                      ),
                      etiqueta: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        data: (lista) {
          if (lista.isEmpty) {
            return ListView(
              children: const [
                SizedBox(height: 200),
                Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Column(
                      children: [
                        Icon(Icons.inbox_outlined, size: 56, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          'No hay pedidos asignados para recoger',
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }
          final grupos = _agruparPorVendedor(lista);
          return ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 8),
            itemCount: grupos.length,
            itemBuilder: (context, index) {
              final grupo = grupos[index];
              return _GrupoVendedor(
                nombre: grupo.nombre,
                pedidos: grupo.pedidos,
                vendedorId: grupo.vendedorId,
                onTapPedido: (id) => context.go('/inicio/recogidas/$id'),
              );
            },
          );
        },
      ),
    );
  }

  List<_GrupoRecogidas> _agruparPorVendedor(List<Pedido> lista) {
    final grupos = <_GrupoRecogidas>[];
    final indicePorVendedor = <String, int>{};
    for (final pedido in lista) {
      final clave = pedido.vendedorId ?? '__sin_vendedor__';
      final indice = indicePorVendedor[clave];
      if (indice == null) {
        indicePorVendedor[clave] = grupos.length;
        grupos.add(_GrupoRecogidas(
          nombre: pedido.nombreVendedor ?? 'Sin vendedor',
          vendedorId: pedido.vendedorId,
          pedidos: [pedido],
        ));
      } else {
        grupos[indice].pedidos.add(pedido);
      }
    }
    return grupos;
  }
}

class _GrupoRecogidas {
  final String nombre;
  final String? vendedorId;
  final List<Pedido> pedidos;

  _GrupoRecogidas({
    required this.nombre,
    required this.vendedorId,
    required this.pedidos,
  });
}

class _GrupoVendedor extends ConsumerStatefulWidget {
  final String nombre;
  final String? vendedorId;
  final List<Pedido> pedidos;
  final void Function(String id) onTapPedido;

  const _GrupoVendedor({
    required this.nombre,
    required this.vendedorId,
    required this.pedidos,
    required this.onTapPedido,
  });

  @override
  ConsumerState<_GrupoVendedor> createState() => _GrupoVendedorEstado();
}

class _GrupoVendedorEstado extends ConsumerState<_GrupoVendedor> {
  bool _enviando = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final avisos = ref.watch(avisosEnviadosPorVendedor);
    final vendedorKey = widget.vendedorId ?? '__sin_vendedor__';
    final enCooldown = vendedorEnCooldown(avisos, vendedorKey);
    final primerPedido = widget.pedidos.first;
    final puedeAvisar = primerPedido.estado == EstadoPedido.ASIGNADO;

    return Theme(
      data: theme.copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        initiallyExpanded: true,
        tilePadding: const EdgeInsets.symmetric(horizontal: 16),
        childrenPadding: EdgeInsets.zero,
        title: Text(
          '${widget.nombre} (${widget.pedidos.length})',
          style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: (_enviando || enCooldown || !puedeAvisar)
                        ? null
                        : () => _avisarLlegada(),
                    icon: Icon(
                      enCooldown ? Icons.check_circle : Icons.storefront,
                      size: 18,
                    ),
                    label: Text(
                      enCooldown
                          ? 'Aviso enviado'
                          : 'Avísale que estoy aquí',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(44),
                    ),
                  ),
                ),
              ],
            ),
          ),
          ...widget.pedidos.map(
            (p) => TarjetaPedido(
              pedido: p,
              onTap: () => widget.onTapPedido(p.id),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _avisarLlegada() async {
    final messenger = ScaffoldMessenger.of(context);
    final repo = ref.read(pedidosRepositorioProveedor);
    final vendedorKey = widget.vendedorId ?? '__sin_vendedor__';
    final primerPedido = widget.pedidos.first;

    setState(() => _enviando = true);
    try {
      Position? pos;
      try {
        pos = await _ubicacionActual();
      } catch (_) {
        // continúa sin geo
      }
      await repo.avisarLlegadaTienda(
        primerPedido.id,
        lat: pos?.latitude,
        lng: pos?.longitude,
      );
      final actuales = ref.read(avisosEnviadosPorVendedor);
      ref.read(avisosEnviadosPorVendedor.notifier).state = {
        ...actuales,
        vendedorKey: DateTime.now(),
      };
      if (!mounted) return;
      messenger.showSnackBar(
        SnackBar(
          content: Text('Aviso enviado a ${widget.nombre}'),
          backgroundColor: Colors.green,
        ),
      );
    } on ExcepcionApi catch (e) {
      messenger.showSnackBar(
        SnackBar(
          content: Text(e.mensaje),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  Future<Position?> _ubicacionActual() async {
    final habilitado = await Geolocator.isLocationServiceEnabled();
    if (!habilitado) return null;
    var permiso = await Geolocator.checkPermission();
    if (permiso == LocationPermission.denied) {
      permiso = await Geolocator.requestPermission();
      if (permiso == LocationPermission.denied) return null;
    }
    if (permiso == LocationPermission.deniedForever) return null;
    return Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
    );
  }
}