import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/pedido.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import 'pedidos_listado_controlador.dart';

final _consultaPedidosProvider = StateProvider.autoDispose<String>((_) => '');

class _ResumenPedidos {
  const _ResumenPedidos({required this.hoy, required this.estaSemana});
  final int hoy;
  final int estaSemana;
}

final _resumenPedidosProvider =
    FutureProvider.autoDispose<_ResumenPedidos>((ref) async {
  final repo = ref.watch(pedidosRepositorioProvider);
  final pedidos = await repo.listarMios();
  final ahora = DateTime.now();
  final inicioHoy = DateTime(ahora.year, ahora.month, ahora.day);
  final inicioSemana = inicioHoy.subtract(const Duration(days: 6));
  var hoy = 0;
  var semana = 0;
  for (final p in pedidos) {
    if (!p.creadoEn.isBefore(inicioHoy)) hoy++;
    if (!p.creadoEn.isBefore(inicioSemana)) semana++;
  }
  return _ResumenPedidos(hoy: hoy, estaSemana: semana);
});

class PedidosListadoPantalla extends ConsumerWidget {
  const PedidosListadoPantalla({super.key});

  static const _filtrosPill = <({String etiqueta, String? estado})>[
    (etiqueta: 'Todos', estado: null),
    (etiqueta: 'Pendientes', estado: 'PENDIENTE_ASIGNACION'),
    (etiqueta: 'Asignados', estado: 'ASIGNADO'),
    (etiqueta: 'En tránsito', estado: 'EN_TRANSITO'),
    (etiqueta: 'En reparto', estado: 'EN_REPARTO'),
    (etiqueta: 'Entregados', estado: 'ENTREGADO'),
    (etiqueta: 'Fallidos', estado: 'FALLIDO'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncPedidos = ref.watch(pedidosListadoProvider);
    final filtros = ref.watch(filtrosPedidosProvider);
    final consulta = ref.watch(_consultaPedidosProvider);

    return Scaffold(
      backgroundColor: TokensRapix.fondo,
      appBar: const _AppBarPedidos(),
      floatingActionButton: _FabNuevoPedido(
        alPresionar: () => context.push('/pedidos/nuevo'),
      ),
      body: SafeArea(
        top: false,
        child: Column(
          children: [
            _BarraBusqueda(
              valor: consulta,
              alCambiar: (texto) =>
                  ref.read(_consultaPedidosProvider.notifier).state = texto,
            ),
            _FilaPills(
              filtros: _filtrosPill,
              estadoActivo: filtros.estado,
              alSeleccionar: (estado) {
                ref.read(filtrosPedidosProvider.notifier).update(
                      (f) => estado == null
                          ? f.copia(limpiarEstado: true)
                          : f.copia(estado: estado),
                    );
              },
            ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () async {
                  ref.invalidate(_resumenPedidosProvider);
                  ref.invalidate(pedidosListadoProvider);
                  await ref.read(pedidosListadoProvider.future);
                },
                child: asyncPedidos.when(
                  data: (lista) {
                    final filtrada = _filtrarPorConsulta(lista, consulta);
                    if (filtrada.isEmpty) {
                      return _ListadoVacio(
                        consulta: consulta,
                        estado: filtros.estado,
                      );
                    }
                    return ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 4, 16, 96),
                      itemCount: filtrada.length,
                      itemBuilder: (_, i) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: _TarjetaPedido(
                          pedido: filtrada[i],
                          alTocar: () =>
                              context.push('/pedidos/${filtrada[i].id}'),
                        ),
                      ),
                    );
                  },
                  loading: () => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  error: (e, _) => _ErrorListado(
                    error: '$e',
                    alReintentar: () =>
                        ref.invalidate(pedidosListadoProvider),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Pedido> _filtrarPorConsulta(List<Pedido> lista, String consulta) {
    final q = consulta.trim().toLowerCase();
    if (q.isEmpty) return lista;
    return lista.where((p) {
      return p.codigoSeguimiento.toLowerCase().contains(q) ||
          p.nombreCliente.toLowerCase().contains(q) ||
          p.direccionDestino.toLowerCase().contains(q);
    }).toList();
  }
}

class _AppBarPedidos extends ConsumerWidget implements PreferredSizeWidget {
  const _AppBarPedidos();

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final resumen = ref.watch(_resumenPedidosProvider);
    final subtitulo = resumen.maybeWhen(
      data: (r) => '${r.estaSemana} esta semana · ${r.hoy} hoy',
      orElse: () => 'Cargando…',
    );
    return AppBar(
      toolbarHeight: 64,
      backgroundColor: TokensRapix.fondo,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      automaticallyImplyLeading: false,
      titleSpacing: 16,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Mis pedidos',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: TokensRapix.tinta,
              letterSpacing: -0.3,
              height: 1.2,
            ),
          ),
          Text(
            subtitulo,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: TokensRapix.tintaSilenciada,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }
}

class _BarraBusqueda extends StatelessWidget {
  const _BarraBusqueda({required this.valor, required this.alCambiar});

  final String valor;
  final ValueChanged<String> alCambiar;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      child: Container(
        decoration: BoxDecoration(
          color: TokensRapix.superficieAlt,
          borderRadius: BorderRadius.circular(14),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        child: Row(
          children: [
            const Icon(
              Icons.search,
              size: 18,
              color: TokensRapix.tintaSilenciada,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextField(
                onChanged: alCambiar,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: TokensRapix.tinta,
                ),
                decoration: InputDecoration(
                  hintText: 'Buscar por código o cliente',
                  hintStyle: GoogleFonts.inter(
                    fontSize: 14,
                    color: TokensRapix.tintaSilenciada,
                  ),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  filled: false,
                ),
              ),
            ),
            if (valor.isNotEmpty)
              GestureDetector(
                onTap: () => alCambiar(''),
                behavior: HitTestBehavior.opaque,
                child: const Padding(
                  padding: EdgeInsets.all(4),
                  child: Icon(
                    Icons.close,
                    size: 16,
                    color: TokensRapix.tintaSilenciada,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _FilaPills extends StatelessWidget {
  const _FilaPills({
    required this.filtros,
    required this.estadoActivo,
    required this.alSeleccionar,
  });

  final List<({String etiqueta, String? estado})> filtros;
  final String? estadoActivo;
  final ValueChanged<String?> alSeleccionar;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: filtros.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (_, i) {
          final f = filtros[i];
          final activo = f.estado == estadoActivo;
          return _Pill(
            etiqueta: f.etiqueta,
            activo: activo,
            alPresionar: () => alSeleccionar(f.estado),
          );
        },
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({
    required this.etiqueta,
    required this.activo,
    required this.alPresionar,
  });

  final String etiqueta;
  final bool activo;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      borderRadius: BorderRadius.circular(TokensRapix.radioPill),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: activo ? TokensRapix.tinta : TokensRapix.superficie,
          borderRadius: BorderRadius.circular(TokensRapix.radioPill),
          border: Border.all(
            color: activo ? TokensRapix.tinta : TokensRapix.contorno,
          ),
        ),
        alignment: Alignment.center,
        child: Text(
          etiqueta,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: activo ? Colors.white : TokensRapix.tinta,
          ),
        ),
      ),
    );
  }
}

class _TarjetaPedido extends StatelessWidget {
  const _TarjetaPedido({required this.pedido, required this.alTocar});

  final Pedido pedido;
  final VoidCallback alTocar;

  @override
  Widget build(BuildContext context) {
    final estados = TokensRapix.estados[pedido.estado];
    final fondoIcono = estados?.fondo ?? TokensRapix.superficieAlt;
    final colorIcono = estados?.texto ?? TokensRapix.tintaSilenciada;
    final codigo = pedido.codigoSeguimiento.isEmpty
        ? '#${pedido.id.substring(0, 6)}'
        : pedido.codigoSeguimiento;

    return InkWell(
      onTap: alTocar,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: TokensRapix.superficie,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: TokensRapix.contorno),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: fondoIcono,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              alignment: Alignment.center,
              child: Icon(
                Icons.inventory_2_outlined,
                size: 20,
                color: colorIcono,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          codigo,
                          style: GoogleFonts.jetBrainsMono(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: TokensRapix.tinta,
                            letterSpacing: 0.2,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      _ChipEstadoRapix(estado: pedido.estado),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    pedido.nombreCliente,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: TokensRapix.tinta,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    pedido.direccionDestino,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: TokensRapix.tintaSilenciada,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  _PieTarjeta(pedido: pedido),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PieTarjeta extends StatelessWidget {
  const _PieTarjeta({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
    final piezas = <Widget>[
      Text(
        _fechaRelativa(pedido.creadoEn),
        style: GoogleFonts.inter(
          fontSize: 11,
          color: TokensRapix.tintaSuave,
        ),
      ),
    ];
    if (pedido.metodoPago == 'CONTRA_ENTREGA' &&
        pedido.montoContraEntrega != null &&
        pedido.montoContraEntrega! > 0) {
      piezas.addAll([
        const _Separador(),
        Text(
          '\$${pedido.montoContraEntrega!.toStringAsFixed(2)}',
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: TokensRapix.tinta,
          ),
        ),
      ]);
    } else if (pedido.tarifaTotal != null && pedido.tarifaTotal! > 0) {
      piezas.addAll([
        const _Separador(),
        Text(
          '\$${pedido.tarifaTotal!.toStringAsFixed(2)}',
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: TokensRapix.tinta,
          ),
        ),
      ]);
    }
    final eta = _etaPorEstado(pedido.estado);
    if (eta != null) {
      piezas.addAll([
        const _Separador(),
        Text(
          eta,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: TokensRapix.verde,
          ),
        ),
      ]);
    }
    return Wrap(
      spacing: 6,
      runSpacing: 2,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: piezas,
    );
  }
}

class _Separador extends StatelessWidget {
  const _Separador();

  @override
  Widget build(BuildContext context) {
    return Text(
      '·',
      style: GoogleFonts.inter(
        fontSize: 11,
        color: TokensRapix.tintaSuave,
      ),
    );
  }
}

class _ChipEstadoRapix extends StatelessWidget {
  const _ChipEstadoRapix({required this.estado});

  final String estado;

  static const Map<String, String> _etiquetas = {
    'PENDIENTE_ASIGNACION': 'Pendiente',
    'ASIGNADO': 'Asignado',
    'RECOGIDO': 'Recogido',
    'EN_TRANSITO': 'En tránsito',
    'EN_PUNTO_INTERCAMBIO': 'En intercambio',
    'EN_REPARTO': 'En reparto',
    'ENTREGADO': 'Entregado',
    'FALLIDO': 'Fallido',
    'DEVUELTO': 'Devuelto',
    'CANCELADO': 'Cancelado',
  };

  @override
  Widget build(BuildContext context) {
    final colores = TokensRapix.estados[estado];
    final etiqueta = _etiquetas[estado] ?? estado.replaceAll('_', ' ');
    final fondo = colores?.fondo ?? TokensRapix.superficieAlt;
    final texto = colores?.texto ?? TokensRapix.tintaSilenciada;
    final punto = colores?.punto ?? TokensRapix.tintaSuave;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: fondo,
        borderRadius: BorderRadius.circular(TokensRapix.radioPill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: punto,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 5),
          Text(
            etiqueta,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: texto,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}

class _FabNuevoPedido extends StatelessWidget {
  const _FabNuevoPedido({required this.alPresionar});

  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: TokensRapix.verde.withValues(alpha: 0.4),
            offset: const Offset(0, 8),
            blurRadius: 20,
          ),
        ],
      ),
      child: FloatingActionButton.extended(
        onPressed: alPresionar,
        backgroundColor: TokensRapix.verde,
        foregroundColor: Colors.white,
        elevation: 0,
        highlightElevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        icon: const Icon(Icons.add, size: 20),
        label: Text(
          'Nuevo',
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _ListadoVacio extends StatelessWidget {
  const _ListadoVacio({required this.consulta, required this.estado});

  final String consulta;
  final String? estado;

  @override
  Widget build(BuildContext context) {
    final hayConsulta = consulta.trim().isNotEmpty;
    final hayFiltro = estado != null;
    final mensaje = hayConsulta
        ? 'Sin resultados para "$consulta"'
        : hayFiltro
            ? 'No hay pedidos en este filtro'
            : 'Aún no tienes pedidos';
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 64, 24, 24),
      children: [
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            color: TokensRapix.superficieAlt,
            borderRadius: BorderRadius.circular(20),
          ),
          alignment: Alignment.center,
          child: const Icon(
            Icons.inbox_outlined,
            size: 32,
            color: TokensRapix.tintaSilenciada,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          mensaje,
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: TokensRapix.tinta,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          hayConsulta || hayFiltro
              ? 'Prueba con otro filtro o búsqueda.'
              : 'Crea tu primer pedido con el botón verde.',
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 13,
            color: TokensRapix.tintaSilenciada,
          ),
        ),
      ],
    );
  }
}

class _ErrorListado extends StatelessWidget {
  const _ErrorListado({required this.error, required this.alReintentar});

  final String error;
  final VoidCallback alReintentar;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 24),
      children: [
        const Icon(
          Icons.error_outline,
          size: 40,
          color: TokensRapix.peligro,
        ),
        const SizedBox(height: 12),
        Text(
          'No se pudieron cargar los pedidos',
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: TokensRapix.tinta,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          error,
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontSize: 12,
            color: TokensRapix.tintaSilenciada,
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: FilledButton.tonal(
            onPressed: alReintentar,
            child: const Text('Reintentar'),
          ),
        ),
      ],
    );
  }
}

String _fechaRelativa(DateTime fecha) {
  final ahora = DateTime.now();
  final inicioHoy = DateTime(ahora.year, ahora.month, ahora.day);
  final inicioAyer = inicioHoy.subtract(const Duration(days: 1));
  final hora = DateFormat('HH:mm');
  if (!fecha.isBefore(inicioHoy)) {
    return 'Hoy ${hora.format(fecha)}';
  }
  if (!fecha.isBefore(inicioAyer)) {
    return 'Ayer ${hora.format(fecha)}';
  }
  return DateFormat('dd/MM HH:mm').format(fecha);
}

String? _etaPorEstado(String estado) {
  switch (estado) {
    case 'EN_REPARTO':
      return 'ETA cercana';
    case 'EN_TRANSITO':
      return 'En camino';
    default:
      return null;
  }
}
