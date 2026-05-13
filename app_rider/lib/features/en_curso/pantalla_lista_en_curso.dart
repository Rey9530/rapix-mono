import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/pedido.dart';
import '../../data/repositorios/pedidos_repositorio.dart';
import '../../widgets/tarjeta_pedido.dart';
import 'proveedor_en_curso.dart';

class PantallaListaEnCurso extends ConsumerStatefulWidget {
  const PantallaListaEnCurso({super.key});

  @override
  ConsumerState<PantallaListaEnCurso> createState() =>
      _PantallaListaEnCursoState();
}

class _PantallaListaEnCursoState extends ConsumerState<PantallaListaEnCurso> {
  final Set<String> _seleccionados = {};
  EstadoPedido? _estadoAnclado;
  bool _ejecutandoBulk = false;

  bool get _modoSeleccion => _estadoAnclado != null;

  void _activarSeleccion(Pedido p) {
    setState(() {
      _estadoAnclado = p.estado;
      _seleccionados.add(p.id);
    });
  }

  void _toggleSeleccion(Pedido p) {
    if (p.estado != _estadoAnclado) return;
    setState(() {
      if (!_seleccionados.add(p.id)) {
        _seleccionados.remove(p.id);
      }
      if (_seleccionados.isEmpty) _estadoAnclado = null;
    });
  }

  void _salirSeleccion() {
    setState(() {
      _seleccionados.clear();
      _estadoAnclado = null;
    });
  }

  Future<void> _ejecutarBulk() async {
    final estado = _estadoAnclado;
    if (estado == null || _seleccionados.isEmpty) return;
    final accion = _accionPara(estado);
    if (accion == null) return;

    final confirmado = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(accion.tituloConfirmacion),
        content: Text(
          'Vas a actualizar ${_seleccionados.length} pedido(s).\n'
          'Nuevo estado: ${accion.descripcion}.\n\n¿Continuar?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Aplicar'),
          ),
        ],
      ),
    );
    if (confirmado != true) return;

    setState(() => _ejecutandoBulk = true);
    final repo = ref.read(pedidosRepositorioProveedor);
    final ids = _seleccionados.toList();
    final resultado = await repo.transicionesBulk(ids, accion.operacion(repo));
    if (!mounted) return;
    setState(() => _ejecutandoBulk = false);

    _mostrarResultado(resultado);
    _salirSeleccion();
    ref.invalidate(pedidosEnCursoProveedor);
  }

  void _mostrarResultado(ResultadoBulk r) {
    final messenger = ScaffoldMessenger.of(context);
    if (r.todoOk) {
      messenger.showSnackBar(
        SnackBar(
          backgroundColor: Colors.green.shade700,
          content: Text('${r.exitosos} de ${r.total} actualizados'),
        ),
      );
      return;
    }
    messenger.showSnackBar(
      SnackBar(
        backgroundColor: Theme.of(context).colorScheme.error,
        content: Text(
          '${r.exitosos} de ${r.total} actualizados, ${r.fallidos.length} fallaron',
        ),
        action: SnackBarAction(
          label: 'Ver',
          textColor: Colors.white,
          onPressed: () => _mostrarFallos(r.fallidos),
        ),
      ),
    );
  }

  void _mostrarFallos(List<FalloBulk> fallidos) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Pedidos que fallaron'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: fallidos.length,
            itemBuilder: (_, i) {
              final f = fallidos[i];
              return ListTile(
                dense: true,
                leading: const Icon(Icons.error_outline, color: Colors.red),
                title: Text(f.pedidoId, style: const TextStyle(fontSize: 12)),
                subtitle: Text(PedidosRepositorio.mensajeError(f.error)),
              );
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    );
  }

  _AccionBulk? _accionPara(EstadoPedido estado) {
    switch (estado) {
      case EstadoPedido.RECOGIDO:
        return _AccionBulk(
          etiqueta: 'Marcar en tránsito',
          tituloConfirmacion: 'Marcar en tránsito',
          descripcion: 'EN_TRANSITO',
          icono: Icons.directions_bike,
          operacion: (repo) => (id) => repo.enTransito(id),
        );
      case EstadoPedido.EN_TRANSITO:
        return _AccionBulk(
          etiqueta: 'Llegué al intercambio',
          tituloConfirmacion: 'Marcar en punto de intercambio',
          descripcion: 'EN_PUNTO_INTERCAMBIO',
          icono: Icons.place,
          operacion: (repo) => (id) => repo.llegarIntercambio(id),
        );
      case EstadoPedido.EN_PUNTO_INTERCAMBIO:
        return _AccionBulk(
          etiqueta: 'Tomar para entrega',
          tituloConfirmacion: 'Tomar para entrega',
          descripcion: 'EN_REPARTO',
          icono: Icons.local_shipping,
          operacion: (repo) => (id) => repo.tomarEntrega(id),
        );
      default:
        return null;
    }
  }

  List<_GrupoEnCurso> _agruparPorVendedor(List<Pedido> lista) {
    final grupos = <_GrupoEnCurso>[];
    final indices = <String, int>{};
    for (final p in lista) {
      final clave = p.vendedorId ?? '__sin_vendedor__';
      final i = indices[clave];
      if (i == null) {
        indices[clave] = grupos.length;
        grupos.add(_GrupoEnCurso(
          nombre: p.nombreVendedor ?? 'Sin vendedor',
          pedidos: [p],
        ));
      } else {
        grupos[i].pedidos.add(p);
      }
    }
    return grupos;
  }

  @override
  Widget build(BuildContext context) {
    final asincrono = ref.watch(pedidosEnCursoProveedor);

    return Stack(
      fit: StackFit.expand,
      children: [
        Column(
          children: [
            if (_modoSeleccion) _BarraSeleccion(
              cantidad: _seleccionados.length,
              accion: _accionPara(_estadoAnclado!),
              onCerrar: _salirSeleccion,
              onAplicar: _ejecutandoBulk ? null : _ejecutarBulk,
            ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () async => ref.invalidate(pedidosEnCursoProveedor),
                child: asincrono.when(
                  loading: () =>
                      const Center(child: CircularProgressIndicator()),
                  error: (e, _) => _Error(
                    mensaje: '$e',
                    onReintentar: () =>
                        ref.invalidate(pedidosEnCursoProveedor),
                  ),
                  data: (lista) {
                    if (lista.isEmpty) return const _EstadoVacio();
                    final grupos = _agruparPorVendedor(lista);
                    return ListView.builder(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      itemCount: grupos.length,
                      itemBuilder: (_, i) => _GrupoVendedor(
                        grupo: grupos[i],
                        estadoAnclado: _estadoAnclado,
                        seleccionados: _seleccionados,
                        modoSeleccion: _modoSeleccion,
                        onTapPedido: (p) {
                          if (_modoSeleccion) {
                            _toggleSeleccion(p);
                          } else {
                            context.go('/inicio/en-curso/${p.id}');
                          }
                        },
                        onLongPressPedido: _activarSeleccion,
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
        if (_ejecutandoBulk)
          const Positioned.fill(
            child: ColoredBox(
              color: Colors.black45,
              child: Center(child: CircularProgressIndicator()),
            ),
          ),
      ],
    );
  }
}

class _BarraSeleccion extends StatelessWidget {
  final int cantidad;
  final _AccionBulk? accion;
  final VoidCallback onCerrar;
  final VoidCallback? onAplicar;

  const _BarraSeleccion({
    required this.cantidad,
    required this.accion,
    required this.onCerrar,
    required this.onAplicar,
  });

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Material(
      color: cs.primaryContainer,
      elevation: 2,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: onCerrar,
                tooltip: 'Cancelar selección',
              ),
              Expanded(
                child: Text(
                  '$cantidad seleccionado${cantidad == 1 ? '' : 's'}',
                  style: TextStyle(
                    color: cs.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              if (accion != null)
                FilledButton.icon(
                  onPressed: onAplicar,
                  icon: Icon(accion!.icono),
                  label: Text(accion!.etiqueta),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GrupoVendedor extends StatelessWidget {
  final _GrupoEnCurso grupo;
  final EstadoPedido? estadoAnclado;
  final Set<String> seleccionados;
  final bool modoSeleccion;
  final void Function(Pedido) onTapPedido;
  final void Function(Pedido) onLongPressPedido;

  const _GrupoVendedor({
    required this.grupo,
    required this.estadoAnclado,
    required this.seleccionados,
    required this.modoSeleccion,
    required this.onTapPedido,
    required this.onLongPressPedido,
  });

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        initiallyExpanded: true,
        tilePadding: const EdgeInsets.symmetric(horizontal: 16),
        childrenPadding: EdgeInsets.zero,
        title: Text(
          '${grupo.nombre} (${grupo.pedidos.length})',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        children: grupo.pedidos.map((p) {
          final deshabilitada =
              modoSeleccion && p.estado != estadoAnclado;
          return TarjetaPedido(
            pedido: p,
            seleccionada: seleccionados.contains(p.id),
            deshabilitada: deshabilitada,
            onTap: () => onTapPedido(p),
            onLongPress: modoSeleccion ? null : () => onLongPressPedido(p),
          );
        }).toList(),
      ),
    );
  }
}

class _EstadoVacio extends StatelessWidget {
  const _EstadoVacio();

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        SizedBox(height: 200),
        Center(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Column(
              children: [
                Icon(Icons.local_shipping_outlined,
                    size: 56, color: Colors.grey),
                SizedBox(height: 16),
                Text(
                  'No tienes pedidos en curso.\nMárcalos como recogidos para verlos aquí.',
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _Error extends StatelessWidget {
  final String mensaje;
  final VoidCallback onReintentar;

  const _Error({required this.mensaje, required this.onReintentar});

  @override
  Widget build(BuildContext context) {
    return ListView(
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
                Text('Error: $mensaje', textAlign: TextAlign.center),
                const SizedBox(height: 12),
                FilledButton.tonal(
                  onPressed: onReintentar,
                  child: const Text('Reintentar'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _GrupoEnCurso {
  final String nombre;
  final List<Pedido> pedidos;
  _GrupoEnCurso({required this.nombre, required this.pedidos});
}

class _AccionBulk {
  final String etiqueta;
  final String tituloConfirmacion;
  final String descripcion;
  final IconData icono;
  final Future<Pedido> Function(String id) Function(PedidosRepositorio repo)
      operacion;

  const _AccionBulk({
    required this.etiqueta,
    required this.tituloConfirmacion,
    required this.descripcion,
    required this.icono,
    required this.operacion,
  });
}
