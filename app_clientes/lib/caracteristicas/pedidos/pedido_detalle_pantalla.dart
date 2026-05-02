import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/pedido.dart';
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
      backgroundColor: TokensRapix.fondo,
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
      backgroundColor: TokensRapix.fondo,
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
          color: TokensRapix.tinta,
          letterSpacing: 0.3,
        ),
      ),
      actions: [
        IconButton(
          tooltip: 'Compartir',
          icon: const Icon(
            Icons.share_outlined,
            size: 20,
            color: TokensRapix.tinta,
          ),
          onPressed: alCompartir,
        ),
        IconButton(
          tooltip: 'Refrescar',
          icon: const Icon(
            Icons.refresh,
            size: 20,
            color: TokensRapix.tinta,
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
    final fondo = estados?.fondo ?? TokensRapix.superficieAlt;
    final colorTexto = estados?.texto ?? TokensRapix.tintaSilenciada;
    final colorPunto = estados?.punto ?? TokensRapix.tintaSuave;
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
                    color: TokensRapix.tinta,
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
          border: Border.all(color: TokensRapix.contorno),
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
        color: TokensRapix.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: TokensRapix.contorno),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: TokensRapix.verdeSuave,
            ),
            alignment: Alignment.center,
            child: Text(
              _iniciales(repartidor.nombreCompleto),
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: TokensRapix.verdeTinta,
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
                    color: TokensRapix.tinta,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  repartidor.telefono ?? 'Sin teléfono',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: TokensRapix.tintaSilenciada,
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
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: TokensRapix.verdeSuave,
        ),
        alignment: Alignment.center,
        child: Icon(icono, size: 18, color: TokensRapix.verdeOscuro),
      ),
    );
  }
}

class _TarjetaDatos extends StatelessWidget {
  const _TarjetaDatos({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
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
        color: TokensRapix.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: TokensRapix.contorno),
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
          ),
        ],
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
  });

  final IconData icono;
  final String etiqueta;
  final String valor;
  final String? valorDerecho;
  final bool ultimo;
  final bool valorMultilinea;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        border: ultimo
            ? null
            : const Border(
                bottom: BorderSide(color: TokensRapix.contornoSuave),
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
              color: TokensRapix.tintaSilenciada,
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
                    color: TokensRapix.tintaSilenciada,
                    letterSpacing: 0.4,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  valor,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: TokensRapix.tinta,
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
                  color: TokensRapix.tintaSilenciada,
                ),
              ),
            ),
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
              color: TokensRapix.tinta,
              letterSpacing: 0.5,
            ),
          ),
        ),
        ClipRRect(
          borderRadius: BorderRadius.circular(TokensRapix.radioLg),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(color: TokensRapix.contorno),
              borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            ),
            child: Image.network(
              url,
              fit: BoxFit.cover,
              height: 220,
              width: double.infinity,
              errorBuilder: (_, _, _) => Container(
                height: 220,
                color: TokensRapix.superficieHundida,
                alignment: Alignment.center,
                child: const Icon(
                  Icons.image_not_supported_outlined,
                  color: TokensRapix.tintaSilenciada,
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
              color: TokensRapix.tinta,
              letterSpacing: 0.5,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
          decoration: BoxDecoration(
            color: TokensRapix.superficie,
            borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            border: Border.all(color: TokensRapix.contorno),
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
