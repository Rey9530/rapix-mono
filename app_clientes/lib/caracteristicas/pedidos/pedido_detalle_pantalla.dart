import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../datos/modelos/pedido.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import '../../nucleo/util/fechas.dart';
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
              if (p.motivoCancelado != null || p.motivoFallo != null) ...[
                const SizedBox(height: 12),
                _BannerMotivo(pedido: p),
              ],
              if (_estadosConTracking.contains(p.estado)) ...[
                const SizedBox(height: 14),
                _ContenedorMapa(pedidoId: p.id, pedido: p),
              ],
              const SizedBox(height: 10),
              _BotonVerMapaCompleto(pedidoId: p.id),
              if (p.repartidorRecogida != null &&
                  p.repartidorRecogida!.id != p.repartidorEntrega?.id) ...[
                const SizedBox(height: 14),
                _TarjetaRepartidor(
                  repartidor: p.repartidorRecogida!,
                  etiqueta: 'REPARTIDOR DE RECOGIDA',
                ),
              ],
              if (p.repartidorEntrega != null) ...[
                const SizedBox(height: 14),
                _TarjetaRepartidor(
                  repartidor: p.repartidorEntrega!,
                  etiqueta: 'REPARTIDOR DE ENTREGA',
                ),
              ],
              const SizedBox(height: 14),
              _TarjetaDatos(pedido: p),
              const SizedBox(height: 14),
              _SeccionDesglose(pedido: p),
              if (_tienePaquete(p)) ...[
                const SizedBox(height: 14),
                _SeccionPaquete(pedido: p),
              ],
              if (_tieneFechas(p)) ...[
                const SizedBox(height: 14),
                _SeccionFechas(pedido: p),
              ],
              if (p.comprobantes.isNotEmpty) ...[
                const SizedBox(height: 14),
                _SeccionComprobantes(comprobantes: p.comprobantes),
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

bool _tienePaquete(Pedido p) =>
    p.descripcionPaquete != null ||
    p.pesoPaqueteKg != null ||
    p.valorDeclarado != null ||
    p.urlFotoPaquete != null;

bool _tieneFechas(Pedido p) =>
    p.programadoPara != null ||
    p.recogidoEn != null ||
    p.enIntercambioEn != null ||
    p.entregadoEn != null ||
    p.canceladoEn != null;

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

String _modoFacturacionLegible(String modo) {
  switch (modo) {
    case 'POR_ENVIO':
      return 'Por envío';
    case 'POR_PAQUETE':
      return 'Por paquete';
    case 'PREPAGADO':
      return 'Prepagado';
    default:
      final partes = modo.toLowerCase().replaceAll('_', ' ');
      return partes.isEmpty
          ? modo
          : partes[0].toUpperCase() + partes.substring(1);
  }
}

Future<void> _abrirUri(BuildContext context, Uri uri) async {
  final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
  if (!ok && context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('No se pudo abrir la aplicación')),
    );
  }
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

class _BannerMotivo extends StatelessWidget {
  const _BannerMotivo({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
    final esCancelado = pedido.motivoCancelado != null;
    final motivo = pedido.motivoCancelado ?? pedido.motivoFallo ?? '';
    final etiqueta =
        esCancelado ? 'MOTIVO DE CANCELACIÓN' : 'MOTIVO DEL FALLO';
    final color =
        esCancelado ? TokensRapix.peligro : TokensRapix.ambar;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            esCancelado ? Icons.block : Icons.warning_amber_outlined,
            size: 20,
            color: color,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  etiqueta,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: color,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  motivo,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
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

class _BotonVerMapaCompleto extends StatelessWidget {
  const _BotonVerMapaCompleto({required this.pedidoId});

  final String pedidoId;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: () => context.push('/pedidos/$pedidoId/mapa'),
      icon: const Icon(Icons.map_outlined, size: 18),
      label: const Text('Ver en mapa completo'),
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 12),
        side: BorderSide(color: tokens(context).contorno),
        foregroundColor: tokens(context).tinta,
      ),
    );
  }
}

class _TarjetaRepartidor extends StatelessWidget {
  const _TarjetaRepartidor({
    required this.repartidor,
    required this.etiqueta,
  });

  final RepartidorAsignado repartidor;
  final String etiqueta;

  Future<void> _llamar(BuildContext context) async {
    final tel = repartidor.telefono;
    if (tel == null || tel.isEmpty) return;
    await _abrirUri(context, Uri.parse('tel:$tel'));
  }

  Future<void> _whatsapp(BuildContext context) async {
    final tel = repartidor.telefono?.replaceAll(RegExp(r'[^\d+]'), '');
    if (tel == null || tel.isEmpty) return;
    await _abrirUri(context, Uri.parse('https://wa.me/$tel'));
  }

  @override
  Widget build(BuildContext context) {
    final tieneTelefono =
        repartidor.telefono != null && repartidor.telefono!.isNotEmpty;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            etiqueta,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: tokens(context).tintaSilenciada,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 10),
          Row(
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
                habilitado: tieneTelefono,
                alPresionar: () => _llamar(context),
              ),
              const SizedBox(width: 8),
              _BotonAccionRepartidor(
                icono: Icons.chat_bubble_outline,
                habilitado: tieneTelefono,
                alPresionar: () => _whatsapp(context),
              ),
            ],
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
    this.habilitado = true,
  });

  final IconData icono;
  final VoidCallback alPresionar;
  final bool habilitado;

  @override
  Widget build(BuildContext context) {
    final fondo = habilitado
        ? tokens(context).verdeSuave
        : tokens(context).superficieHundida;
    final tinta =
        habilitado ? TokensRapix.verdeOscuro : tokens(context).tintaSilenciada;
    return InkWell(
      onTap: habilitado ? alPresionar : null,
      customBorder: const CircleBorder(),
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: fondo,
        ),
        alignment: Alignment.center,
        child: Icon(icono, size: 18, color: tinta),
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
            trailing: pedido.esEditable
                ? IconButton(
                    icon: const Icon(Icons.edit_outlined, size: 18),
                    color: TokensRapix.verde,
                    tooltip: 'Editar cliente',
                    onPressed: () =>
                        _abrirEditorCliente(context, ref, pedido),
                  )
                : null,
          ),
          if (pedido.emailCliente != null)
            _FilaDato(
              icono: Icons.email_outlined,
              etiqueta: 'EMAIL',
              valor: pedido.emailCliente!,
            ),
          _FilaDato(
            icono: Icons.store_outlined,
            etiqueta: 'ORIGEN',
            valor: pedido.direccionOrigen,
            valorSecundario: pedido.zonaOrigen?.nombre,
            valorMultilinea: true,
            trailing: IconButton(
              icon: const Icon(Icons.map_outlined, size: 18),
              color: TokensRapix.verde,
              tooltip: 'Ver origen en mapa',
              onPressed: () =>
                  context.push('/pedidos/${pedido.id}/mapa?enfoque=origen'),
            ),
          ),
          if (pedido.notasOrigen != null && pedido.notasOrigen!.isNotEmpty)
            _FilaDato(
              icono: Icons.sticky_note_2_outlined,
              etiqueta: 'NOTAS ORIGEN',
              valor: pedido.notasOrigen!,
              valorMultilinea: true,
              destacado: true,
            ),
          _FilaDato(
            icono: Icons.place_outlined,
            etiqueta: 'DESTINO',
            valor: pedido.direccionDestino,
            valorSecundario: pedido.zonaDestino?.nombre,
            valorMultilinea: true,
            trailing: IconButton(
              icon: const Icon(Icons.map_outlined, size: 18),
              color: TokensRapix.verde,
              tooltip: 'Ver destino en mapa',
              onPressed: () =>
                  context.push('/pedidos/${pedido.id}/mapa?enfoque=destino'),
            ),
          ),
          if (pedido.notasDestino != null && pedido.notasDestino!.isNotEmpty)
            _FilaDato(
              icono: Icons.sticky_note_2_outlined,
              etiqueta: 'NOTAS DESTINO',
              valor: pedido.notasDestino!,
              valorMultilinea: true,
              destacado: true,
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

class _SeccionDesglose extends StatelessWidget {
  const _SeccionDesglose({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
    final formato = NumberFormat.currency(symbol: r'$', decimalDigits: 2);
    final costo = pedido.costoEnvio ?? pedido.tarifaTotal;
    final esContraEntrega = pedido.metodoPago == 'CONTRA_ENTREGA';
    final monto = pedido.montoContraEntrega;
    final mostrarTotal = esContraEntrega && costo != null && monto != null;

    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          _CabeceraSeccion(etiqueta: 'DESGLOSE'),
          if (costo != null)
            _FilaDato(
              icono: Icons.local_shipping_outlined,
              etiqueta: 'COSTO DE ENVÍO',
              valor: formato.format(costo),
            ),
          if (esContraEntrega && monto != null)
            _FilaDato(
              icono: Icons.payments_outlined,
              etiqueta: 'MONTO CONTRA ENTREGA',
              valor: formato.format(monto),
            ),
          if (mostrarTotal)
            _FilaDato(
              icono: Icons.calculate_outlined,
              etiqueta: 'TOTAL A COBRAR',
              valor: formato.format(costo + monto),
              destacado: true,
            ),
          if (pedido.modoFacturacion != null)
            _FilaDato(
              icono: Icons.receipt_long_outlined,
              etiqueta: 'FACTURACIÓN',
              valor: _modoFacturacionLegible(pedido.modoFacturacion!),
              ultimo: true,
            ),
        ],
      ),
    );
  }
}

class _SeccionPaquete extends StatelessWidget {
  const _SeccionPaquete({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
    final formato = NumberFormat.currency(symbol: r'$', decimalDigits: 2);
    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          _CabeceraSeccion(etiqueta: 'PAQUETE'),
          if (pedido.descripcionPaquete != null)
            _FilaDato(
              icono: Icons.inventory_2_outlined,
              etiqueta: 'DESCRIPCIÓN',
              valor: pedido.descripcionPaquete!,
              valorMultilinea: true,
            ),
          if (pedido.pesoPaqueteKg != null)
            _FilaDato(
              icono: Icons.scale_outlined,
              etiqueta: 'PESO',
              valor:
                  '${pedido.pesoPaqueteKg!.toStringAsFixed(2)} kg',
            ),
          if (pedido.valorDeclarado != null)
            _FilaDato(
              icono: Icons.attach_money_outlined,
              etiqueta: 'VALOR DECLARADO',
              valor: formato.format(pedido.valorDeclarado),
            ),
          if (pedido.urlFotoPaquete != null)
            Padding(
              padding: const EdgeInsets.all(14),
              child: GestureDetector(
                onTap: () => _abrirVisor(context, pedido.urlFotoPaquete!),
                child: ClipRRect(
                  borderRadius:
                      BorderRadius.circular(TokensRapix.radioMd),
                  child: Image.network(
                    pedido.urlFotoPaquete!,
                    height: 140,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      height: 140,
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
            ),
        ],
      ),
    );
  }
}

class _SeccionFechas extends StatelessWidget {
  const _SeccionFechas({required this.pedido});

  final Pedido pedido;

  @override
  Widget build(BuildContext context) {
    final entradas = <_EntradaFecha>[];
    void agregar(IconData icono, String etiqueta, DateTime? fecha,
        {bool relativa = false}) {
      if (fecha == null) return;
      entradas.add(_EntradaFecha(icono, etiqueta, fecha, relativa));
    }

    agregar(Icons.add_circle_outline, 'CREADO', pedido.creadoEn, relativa: true);
    agregar(Icons.schedule_outlined, 'PROGRAMADO PARA', pedido.programadoPara);
    agregar(Icons.inventory_2_outlined, 'RECOGIDO', pedido.recogidoEn);
    agregar(Icons.swap_horiz, 'EN INTERCAMBIO', pedido.enIntercambioEn);
    agregar(Icons.check_circle_outline, 'ENTREGADO', pedido.entregadoEn);
    agregar(Icons.block, 'CANCELADO', pedido.canceladoEn);

    if (entradas.isEmpty) return const SizedBox.shrink();
    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          _CabeceraSeccion(etiqueta: 'FECHAS'),
          for (var i = 0; i < entradas.length; i++)
            _FilaDato(
              icono: entradas[i].icono,
              etiqueta: entradas[i].etiqueta,
              valor: entradas[i].relativa
                  ? tiempoRelativo(entradas[i].fecha)
                  : fechaLegible(entradas[i].fecha),
              valorSecundario: entradas[i].relativa
                  ? fechaLegible(entradas[i].fecha)
                  : null,
              ultimo: i == entradas.length - 1,
            ),
        ],
      ),
    );
  }
}

class _EntradaFecha {
  const _EntradaFecha(this.icono, this.etiqueta, this.fecha, this.relativa);
  final IconData icono;
  final String etiqueta;
  final DateTime fecha;
  final bool relativa;
}

class _SeccionComprobantes extends StatelessWidget {
  const _SeccionComprobantes({required this.comprobantes});

  final List<ComprobantePedido> comprobantes;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 0, 4, 10),
          child: Text(
            'COMPROBANTES DE ENTREGA',
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: tokens(context).tinta,
              letterSpacing: 0.5,
            ),
          ),
        ),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: tokens(context).superficie,
            borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            border: Border.all(color: tokens(context).contorno),
          ),
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              for (final c in comprobantes)
                GestureDetector(
                  onTap: () => _abrirVisor(context, c.url),
                  child: ClipRRect(
                    borderRadius:
                        BorderRadius.circular(TokensRapix.radioMd),
                    child: Image.network(
                      c.url,
                      width: 100,
                      height: 100,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => Container(
                        width: 100,
                        height: 100,
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
          ),
        ),
      ],
    );
  }
}

void _abrirVisor(BuildContext context, String url) {
  showDialog<void>(
    context: context,
    builder: (ctx) {
      return Dialog(
        backgroundColor: Colors.black,
        insetPadding: const EdgeInsets.all(16),
        child: Stack(
          children: [
            InteractiveViewer(
              child: Center(
                child: Image.network(
                  url,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => const Padding(
                    padding: EdgeInsets.all(24),
                    child: Icon(
                      Icons.image_not_supported_outlined,
                      color: Colors.white,
                      size: 48,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () => Navigator.pop(ctx),
              ),
            ),
          ],
        ),
      );
    },
  );
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

Future<void> _abrirEditorCliente(
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
      child: _EditorCliente(pedido: pedido),
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

class _EditorCliente extends ConsumerStatefulWidget {
  const _EditorCliente({required this.pedido});

  final Pedido pedido;

  @override
  ConsumerState<_EditorCliente> createState() => _EditorClienteEstado();
}

class _EditorClienteEstado extends ConsumerState<_EditorCliente> {
  late final TextEditingController _nombre =
      TextEditingController(text: widget.pedido.nombreCliente);
  late final TextEditingController _telefono =
      TextEditingController(text: widget.pedido.telefonoCliente);
  bool _guardando = false;
  String? _errorNombre;
  String? _errorTelefono;

  static final _regexTelefono = RegExp(r'^\+?[0-9]{8,15}$');

  @override
  void dispose() {
    _nombre.dispose();
    _telefono.dispose();
    super.dispose();
  }

  Future<void> _guardar() async {
    final nombre = _nombre.text.trim();
    final telefono = _telefono.text.trim();
    setState(() {
      _errorNombre = null;
      _errorTelefono = null;
    });
    bool valido = true;
    if (nombre.length < 2 || nombre.length > 100) {
      setState(() => _errorNombre = 'Entre 2 y 100 caracteres');
      valido = false;
    }
    if (!_regexTelefono.hasMatch(telefono)) {
      setState(() => _errorTelefono = '8-15 dígitos, opcional con +');
      valido = false;
    }
    if (!valido) return;

    setState(() => _guardando = true);
    try {
      await ref.read(pedidosRepositorioProvider).actualizar(
            widget.pedido.id,
            ActualizarPedidoEntrada(
              nombreCliente: nombre,
              telefonoCliente: telefono,
            ),
          );
      if (!mounted) return;
      ref.invalidate(pedidoDetalleProvider(widget.pedido.id));
      ref.invalidate(pedidosListadoProvider);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cliente actualizado')),
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
              'Editar cliente',
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: tokens(context).tinta,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'NOMBRE',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: tokens(context).tintaSilenciada,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _nombre,
              textCapitalization: TextCapitalization.words,
              decoration: InputDecoration(
                errorText: _errorNombre,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                ),
                isDense: true,
              ),
              maxLength: 100,
            ),
            const SizedBox(height: 8),
            Text(
              'TELÉFONO',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: tokens(context).tintaSilenciada,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _telefono,
              keyboardType: TextInputType.phone,
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'[0-9+]')),
              ],
              decoration: InputDecoration(
                hintText: '+503 70001234',
                errorText: _errorTelefono,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                ),
                isDense: true,
              ),
              maxLength: 15,
            ),
            const SizedBox(height: 12),
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
    if (mensaje is List && mensaje.isNotEmpty) {
      return mensaje.first.toString();
    }
  }
  return 'No se pudo actualizar. Intenta de nuevo.';
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

class _CabeceraSeccion extends StatelessWidget {
  const _CabeceraSeccion({required this.etiqueta});

  final String etiqueta;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: tokens(context).contornoSuave),
        ),
      ),
      child: Text(
        etiqueta,
        style: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: tokens(context).tintaSilenciada,
          letterSpacing: 0.6,
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
    this.valorSecundario,
    this.ultimo = false,
    this.valorMultilinea = false,
    this.trailing,
    this.destacado = false,
  });

  final IconData icono;
  final String etiqueta;
  final String valor;
  final String? valorDerecho;
  final String? valorSecundario;
  final bool ultimo;
  final bool valorMultilinea;
  final Widget? trailing;
  final bool destacado;

  @override
  Widget build(BuildContext context) {
    final colorTinta =
        destacado ? TokensRapix.verdeOscuro : tokens(context).tinta;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: destacado
            ? tokens(context).verdeSuave.withValues(alpha: 0.4)
            : null,
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
              color: destacado
                  ? TokensRapix.verdeOscuro
                  : tokens(context).tintaSilenciada,
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
                    color: colorTinta,
                    height: 1.3,
                  ),
                  maxLines: valorMultilinea ? 3 : 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (valorSecundario != null && valorSecundario!.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    valorSecundario!,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: tokens(context).tintaSilenciada,
                    ),
                  ),
                ],
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
