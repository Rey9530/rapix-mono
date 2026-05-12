import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/pedido.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import '../../widgets/linea_tiempo_estado.dart';
import 'mapa_seguimiento_vivo.dart';
import 'pedidos_listado_controlador.dart';

class PedidoDetallePantalla extends ConsumerWidget {
  const PedidoDetallePantalla({super.key, required this.pedidoId});

  final String pedidoId;

  static const _estadosConTracking = {
    'ASIGNADO',
    'RECOGIDO',
    'EN_TRANSITO',
    'EN_PUNTO_INTERCAMBIO',
    'EN_REPARTO',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pedido = ref.watch(pedidoDetalleProvider(pedidoId));

    return Scaffold(
      backgroundColor: tokens(context).fondo,
      appBar: _AppBarDetalle(
        codigo: pedido.maybeWhen(
          data: (p) => p.codigoSeguimiento,
          orElse: () => '',
        ),
        alCompartir: () => _mostrarProximamente(
          context,
          'Compartir tracking del pedido',
        ),
        alRefrescar: () => ref.invalidate(pedidoDetalleProvider(pedidoId)),
      ),
      body: pedido.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorDetalle(
          error: '$e',
          alReintentar: () => ref.invalidate(pedidoDetalleProvider(pedidoId)),
        ),
        data: (p) => RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(pedidoDetalleProvider(pedidoId));
            await ref.read(pedidoDetalleProvider(pedidoId).future);
          },
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
            children: [
              _BannerEstado(pedido: p),
              if (_estadosConTracking.contains(p.estado)) ...[
                const SizedBox(height: 14),
                _ContenedorMapa(pedidoId: p.id, pedido: p),
              ],
              if (p.repartidorEntrega != null) ...[
                const SizedBox(height: 14),
                _TarjetaRepartidor(repartidor: p.repartidorEntrega!),
              ],
              const SizedBox(height: 14),
              _TarjetaDatos(pedido: p),
              if (p.estado == 'ENTREGADO' && p.comprobantes.isNotEmpty) ...[
                const SizedBox(height: 14),
                _ComprobanteEntrega(url: p.comprobantes.first.url),
              ],
              const SizedBox(height: 14),
              _SeccionLineaTiempo(eventos: p.eventos),
            ],
          ),
        ),
      ),
    );
  }
}

void _mostrarProximamente(BuildContext context, String funcionalidad) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('$funcionalidad — próximamente')),
  );
}

String _iniciales(String nombre) {
  final palabras = nombre.trim().split(RegExp(r'\s+'));
  if (palabras.isEmpty || palabras.first.isEmpty) return '··';
  if (palabras.length == 1) {
    final p = palabras.first;
    return (p.length >= 2 ? p.substring(0, 2) : p).toUpperCase();
  }
  return (palabras.first[0] + palabras.last[0]).toUpperCase();
}

class _AppBarDetalle extends StatelessWidget implements PreferredSizeWidget {
  const _AppBarDetalle({
    required this.codigo,
    required this.alCompartir,
    required this.alRefrescar,
  });

  final String codigo;
  final VoidCallback alCompartir;
  final VoidCallback alRefrescar;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: tokens(context).fondo,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, size: 22),
        onPressed: () => context.pop(),
      ),
      titleSpacing: 0,
      title: Text(
        codigo,
        style: GoogleFonts.jetBrainsMono(
          fontSize: 15,
          fontWeight: FontWeight.w700,
          color: tokens(context).tinta,
          letterSpacing: 0.3,
        ),
      ),
      actions: [
        IconButton(
          tooltip: 'Compartir',
          icon: Icon(
            Icons.share_outlined,
            size: 20,
            color: tokens(context).tinta,
          ),
          onPressed: alCompartir,
        ),
        IconButton(
          tooltip: 'Refrescar',
          icon: Icon(
            Icons.refresh,
            size: 20,
            color: tokens(context).tinta,
          ),
          onPressed: alRefrescar,
        ),
        const SizedBox(width: 4),
      ],
    );
  }
}

class _BannerEstado extends StatelessWidget {
  const _BannerEstado({required this.pedido});

  final Pedido pedido;

  static const _iconos = <String, IconData>{
    'PENDIENTE_ASIGNACION': Icons.hourglass_top,
    'ASIGNADO': Icons.assignment_ind_outlined,
    'RECOGIDO': Icons.inventory_2_outlined,
    'EN_TRANSITO': Icons.local_shipping_outlined,
    'EN_PUNTO_INTERCAMBIO': Icons.swap_horiz,
    'EN_REPARTO': Icons.delivery_dining,
    'ENTREGADO': Icons.check_circle_outline,
    'FALLIDO': Icons.cancel_outlined,
    'DEVUELTO': Icons.assignment_return_outlined,
    'CANCELADO': Icons.block,
  };

  static const _etiquetas = <String, String>{
    'PENDIENTE_ASIGNACION': 'PENDIENTE',
    'ASIGNADO': 'ASIGNADO',
    'RECOGIDO': 'RECOGIDO',
    'EN_TRANSITO': 'EN TRÁNSITO',
    'EN_PUNTO_INTERCAMBIO': 'EN INTERCAMBIO',
    'EN_REPARTO': 'EN REPARTO',
    'ENTREGADO': 'ENTREGADO',
    'FALLIDO': 'FALLIDO',
    'DEVUELTO': 'DEVUELTO',
    'CANCELADO': 'CANCELADO',
  };

  static const _descripciones = <String, String>{
    'PENDIENTE_ASIGNACION': 'Esperando que un repartidor lo tome',
    'ASIGNADO': 'Un repartidor está en camino a recogerlo',
    'RECOGIDO': 'El paquete ya fue recogido',
    'EN_TRANSITO': 'En camino al punto de intercambio',
    'EN_PUNTO_INTERCAMBIO': 'En el centro de redistribución',
    'EN_REPARTO': 'El repartidor va al destino',
    'ENTREGADO': 'Entregado correctamente',
    'FALLIDO': 'No se pudo entregar el paquete',
    'DEVUELTO': 'Devuelto a la tienda',
    'CANCELADO': 'Pedido cancelado',
  };

  @override
  Widget build(BuildContext context) {
    final estados = TokensRapix.estados[pedido.estado];
    final fondo = estados?.fondo ?? tokens(context).superficieAlt;
    final colorTexto = estados?.texto ?? tokens(context).tintaSilenciada;
    final colorPunto = estados?.punto ?? tokens(context).tintaSuave;
    final icono = _iconos[pedido.estado] ?? Icons.info_outline;
    final etiqueta = _etiquetas[pedido.estado] ?? pedido.estado.replaceAll('_', ' ');
    final descripcion =
        _descripciones[pedido.estado] ?? 'Sin descripción disponible';

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: fondo,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: colorPunto,
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Icon(icono, size: 20, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  etiqueta,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: colorTexto,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  descripcion,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: tokens(context).tinta,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ContenedorMapa extends StatelessWidget {
  const _ContenedorMapa({required this.pedidoId, required this.pedido});

  final String pedidoId;
  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(TokensRapix.radioLg),
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: tokens(context).contorno),
          borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        ),
        child: MapaSeguimientoVivo(pedidoId: pedidoId, pedido: pedido),
      ),
    );
  }
}

class _TarjetaRepartidor extends StatelessWidget {
  const _TarjetaRepartidor({required this.repartidor});

  final RepartidorAsignado repartidor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: tokens(context).verdeSuave,
            ),
            alignment: Alignment.center,
            child: Text(
              _iniciales(repartidor.nombreCompleto),
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: tokens(context).verdeTinta,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  repartidor.nombreCompleto,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: tokens(context).tinta,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  repartidor.telefono ?? 'Sin teléfono',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: tokens(context).tintaSilenciada,
                  ),
                ),
              ],
            ),
          ),
          _BotonAccionRepartidor(
            icono: Icons.phone,
            alPresionar: () => _mostrarProximamente(
              context,
              'Llamar al repartidor',
            ),
          ),
          const SizedBox(width: 8),
          _BotonAccionRepartidor(
            icono: Icons.chat_bubble_outline,
            alPresionar: () => _mostrarProximamente(
              context,
              'Mensaje al repartidor',
            ),
          ),
        ],
      ),
    );
  }
}

class _BotonAccionRepartidor extends StatelessWidget {
  const _BotonAccionRepartidor({
    required this.icono,
    required this.alPresionar,
  });

  final IconData icono;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      customBorder: const CircleBorder(),
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: tokens(context).verdeSuave,
        ),
        alignment: Alignment.center,
        child: Icon(icono, size: 18, color: TokensRapix.verdeOscuro),
      ),
    );
  }
}

class _TarjetaDatos extends ConsumerWidget {
  const _TarjetaDatos({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final formato = NumberFormat.currency(symbol: r'$', decimalDigits: 2);
    final esContraEntrega = pedido.metodoPago == 'CONTRA_ENTREGA';
    final montoPago = esContraEntrega
        ? (pedido.montoContraEntrega != null
            ? formato.format(pedido.montoContraEntrega)
            : null)
        : (pedido.tarifaTotal != null
            ? formato.format(pedido.tarifaTotal)
            : null);

    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          _FilaDato(
            icono: Icons.person_outline,
            etiqueta: 'CLIENTE',
            valor: pedido.nombreCliente,
            valorDerecho: pedido.telefonoCliente,
          ),
          _FilaDato(
            icono: Icons.place_outlined,
            etiqueta: 'DESTINO',
            valor: pedido.direccionDestino,
            valorMultilinea: true,
          ),
          _FilaDato(
            icono: Icons.payments_outlined,
            etiqueta: 'PAGO',
            valor: esContraEntrega ? 'Contra entrega' : 'Prepagado',
            valorDerecho: montoPago,
            ultimo: true,
            trailing: pedido.esEditable
                ? IconButton(
                    icon: const Icon(Icons.edit_outlined, size: 18),
                    color: TokensRapix.verde,
                    tooltip: 'Editar pago',
                    onPressed: () => _abrirEditorPago(context, ref, pedido),
                  )
                : null,
          ),
        ],
      ),
    );
  }
}

Future<void> _abrirEditorPago(
  BuildContext context,
  WidgetRef ref,
  Pedido pedido,
) async {
  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: tokens(context).superficie,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(ctx).viewInsets.bottom,
      ),
      child: _EditorPago(pedido: pedido),
    ),
  );
}

class _EditorPago extends ConsumerStatefulWidget {
  const _EditorPago({required this.pedido});

  final Pedido pedido;

  @override
  ConsumerState<_EditorPago> createState() => _EditorPagoEstado();
}

class _EditorPagoEstado extends ConsumerState<_EditorPago> {
  late String _metodoPago = widget.pedido.metodoPago;
  late final TextEditingController _monto = TextEditingController(
    text: widget.pedido.montoContraEntrega?.toStringAsFixed(2) ?? '',
  );
  bool _guardando = false;
  String? _errorMonto;

  @override
  void dispose() {
    _monto.dispose();
    super.dispose();
  }

  Future<void> _guardar() async {
    setState(() => _errorMonto = null);
    double? monto;
    if (_metodoPago == 'CONTRA_ENTREGA') {
      monto = double.tryParse(_monto.text.trim());
      if (monto == null || monto <= 0) {
        setState(() => _errorMonto = 'Ingresa un monto válido');
        return;
      }
    }
    setState(() => _guardando = true);
    try {
      await ref.read(pedidosRepositorioProvider).actualizar(
            widget.pedido.id,
            ActualizarPedidoEntrada(
              metodoPago: _metodoPago,
              montoContraEntrega: monto,
            ),
          );
      if (!mounted) return;
      ref.invalidate(pedidoDetalleProvider(widget.pedido.id));
      ref.invalidate(pedidosListadoProvider);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pago actualizado')),
      );
    } on DioException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_mensajeError(e))),
      );
    } finally {
      if (mounted) setState(() => _guardando = false);
    }
  }

  String _mensajeError(DioException e) {
    final datos = e.response?.data;
    if (datos is Map<String, dynamic>) {
      final codigo = datos['codigo'] as String?;
      if (codigo == 'PEDIDO_NO_EDITABLE') {
        return 'Este pedido ya no se puede editar';
      }
      if (codigo == 'PEDIDO_MONTO_CONTRA_ENTREGA_REQUERIDO') {
        return 'Debes ingresar el monto a cobrar';
      }
      final mensaje = datos['mensaje'] ?? datos['message'];
      if (mensaje is String && mensaje.isNotEmpty) return mensaje;
    }
    return 'No se pudo actualizar. Intenta de nuevo.';
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: tokens(context).contorno,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Editar pago',
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: tokens(context).tinta,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _OpcionMetodoPago(
                    etiqueta: 'Contra entrega',
                    icono: Icons.payments_outlined,
                    seleccionado: _metodoPago == 'CONTRA_ENTREGA',
                    alPresionar: () =>
                        setState(() => _metodoPago = 'CONTRA_ENTREGA'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _OpcionMetodoPago(
                    etiqueta: 'Prepagado',
                    icono: Icons.credit_card,
                    seleccionado: _metodoPago == 'PREPAGADO',
                    alPresionar: () =>
                        setState(() => _metodoPago = 'PREPAGADO'),
                  ),
                ),
              ],
            ),
            if (_metodoPago == 'CONTRA_ENTREGA') ...[
              const SizedBox(height: 16),
              Text(
                'MONTO A COBRAR',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: tokens(context).tintaSilenciada,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _monto,
                keyboardType:
                    const TextInputType.numberWithOptions(decimal: true),
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}')),
                ],
                decoration: InputDecoration(
                  prefixText: r'$ ',
                  errorText: _errorMonto,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                  ),
                  isDense: true,
                ),
              ),
            ],
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _guardando ? null : () => Navigator.pop(context),
                    child: const Text('Cancelar'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _guardando ? null : _guardar,
                    child: _guardando
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Guardar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OpcionMetodoPago extends StatelessWidget {
  const _OpcionMetodoPago({
    required this.etiqueta,
    required this.icono,
    required this.seleccionado,
    required this.alPresionar,
  });

  final String etiqueta;
  final IconData icono;
  final bool seleccionado;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
        decoration: BoxDecoration(
          color: seleccionado
              ? tokens(context).verdeSuave
              : tokens(context).superficie,
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          border: Border.all(
            color: seleccionado
                ? TokensRapix.verde
                : tokens(context).contorno,
            width: seleccionado ? 1.5 : 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icono,
              size: 16,
              color: seleccionado
                  ? TokensRapix.verdeOscuro
                  : tokens(context).tintaSilenciada,
            ),
            const SizedBox(width: 6),
            Text(
              etiqueta,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: seleccionado
                    ? TokensRapix.verdeOscuro
                    : tokens(context).tinta,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FilaDato extends StatelessWidget {
  const _FilaDato({
    required this.icono,
    required this.etiqueta,
    required this.valor,
    this.valorDerecho,
    this.ultimo = false,
    this.valorMultilinea = false,
    this.trailing,
  });

  final IconData icono;
  final String etiqueta;
  final String valor;
  final String? valorDerecho;
  final bool ultimo;
  final bool valorMultilinea;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        border: ultimo
            ? null
            : Border(
                bottom: BorderSide(color: tokens(context).contornoSuave),
              ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 2),
            child: Icon(
              icono,
              size: 18,
              color: tokens(context).tintaSilenciada,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  etiqueta,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: tokens(context).tintaSilenciada,
                    letterSpacing: 0.4,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  valor,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: tokens(context).tinta,
                    height: 1.3,
                  ),
                  maxLines: valorMultilinea ? 2 : 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          if (valorDerecho != null && valorDerecho!.isNotEmpty) ...[
            const SizedBox(width: 12),
            Padding(
              padding: const EdgeInsets.only(top: 16),
              child: Text(
                valorDerecho!,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: tokens(context).tintaSilenciada,
                ),
              ),
            ),
          ],
          if (trailing != null) ...[
            const SizedBox(width: 8),
            trailing!,
          ],
        ],
      ),
    );
  }
}

class _ComprobanteEntrega extends StatelessWidget {
  const _ComprobanteEntrega({required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 10),
          child: Text(
            'COMPROBANTE DE ENTREGA',
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: tokens(context).tinta,
              letterSpacing: 0.5,
            ),
          ),
        ),
        ClipRRect(
          borderRadius: BorderRadius.circular(TokensRapix.radioLg),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(color: tokens(context).contorno),
              borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            ),
            child: Image.network(
              url,
              fit: BoxFit.cover,
              height: 220,
              width: double.infinity,
              errorBuilder: (_, _, _) => Container(
                height: 220,
                color: tokens(context).superficieHundida,
                alignment: Alignment.center,
                child: Icon(
                  Icons.image_not_supported_outlined,
                  color: tokens(context).tintaSilenciada,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _SeccionLineaTiempo extends StatelessWidget {
  const _SeccionLineaTiempo({required this.eventos});

  final List<EventoPedido> eventos;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 10),
          child: Text(
            'LÍNEA DE TIEMPO',
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: tokens(context).tinta,
              letterSpacing: 0.5,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
          decoration: BoxDecoration(
            color: tokens(context).superficie,
            borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            border: Border.all(color: tokens(context).contorno),
          ),
          child: LineaTiempoEstado(eventos: eventos),
        ),
      ],
    );
  }
}

class _ErrorDetalle extends StatelessWidget {
  const _ErrorDetalle({required this.error, required this.alReintentar});

  final String error;
  final VoidCallback alReintentar;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline,
              size: 40,
              color: TokensRapix.peligro,
            ),
            const SizedBox(height: 12),
            Text(
              'No se pudo cargar el pedido',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: tokens(context).tinta,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              error,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: tokens(context).tintaSilenciada,
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.tonal(
              onPressed: alReintentar,
              child: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}
