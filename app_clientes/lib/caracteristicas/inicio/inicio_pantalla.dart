import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../datos/modelos/pedido.dart';
import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import '../autenticacion/autenticacion_controlador.dart';
import '../paquetes/paquetes_controlador.dart';

class _MetricasInicio {
  const _MetricasInicio({
    required this.enTransito,
    required this.entregadosHoy,
    required this.pendientes,
    required this.estaSemana,
  });

  final int enTransito;
  final int entregadosHoy;
  final int pendientes;
  final int estaSemana;

  static const _enTransito = {'RECOGIDO', 'EN_TRANSITO', 'EN_REPARTO'};
  static const _pendientes = {'PENDIENTE_ASIGNACION', 'ASIGNADO'};

  factory _MetricasInicio.desdeLista(List<Pedido> pedidos) {
    final ahora = DateTime.now();
    final inicioHoy = DateTime(ahora.year, ahora.month, ahora.day);
    final inicioSemana = inicioHoy.subtract(const Duration(days: 6));

    var enTransito = 0;
    var entregadosHoy = 0;
    var pendientes = 0;
    var estaSemana = 0;

    for (final p in pedidos) {
      if (_enTransito.contains(p.estado)) enTransito++;
      if (_pendientes.contains(p.estado)) pendientes++;
      if (p.estado == 'ENTREGADO' && !p.creadoEn.isBefore(inicioHoy)) {
        entregadosHoy++;
      }
      if (!p.creadoEn.isBefore(inicioSemana)) estaSemana++;
    }
    return _MetricasInicio(
      enTransito: enTransito,
      entregadosHoy: entregadosHoy,
      pendientes: pendientes,
      estaSemana: estaSemana,
    );
  }
}

final _metricasInicioProvider =
    FutureProvider.autoDispose<_MetricasInicio>((ref) async {
  final repo = ref.watch(pedidosRepositorioProvider);
  final pedidos = await repo.listarMios();
  return _MetricasInicio.desdeLista(pedidos);
});

class InicioPantalla extends ConsumerWidget {
  const InicioPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(autenticacionControladorProvider);
    final usuario = estado.usuario;
    final negocio = usuario?.perfilVendedor?.nombreNegocio;
    final titulo = negocio ?? usuario?.nombreCompleto ?? 'Inicio';
    final subtitulo = _subtituloDesde(usuario?.perfilVendedor?.direccion);
    final iniciales = _iniciales(negocio ?? usuario?.nombreCompleto ?? '');

    return Scaffold(
      backgroundColor: tokens(context).fondo,
      appBar: _AppBarInicio(
        iniciales: iniciales,
        titulo: titulo,
        subtitulo: subtitulo,
        alPresionarCampana: () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notificaciones — próximamente')),
        ),
      ),
      body: SafeArea(
        top: false,
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(saldoProvider);
            ref.invalidate(_metricasInicioProvider);
            await Future.wait([
              ref.read(saldoProvider.future),
              ref.read(_metricasInicioProvider.future),
            ]);
          },
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
            children: [
              const _HeroNuevoPedido(),
              const SizedBox(height: 12),
              const _SaldoStrip(),
              const SizedBox(height: 14),
              const _GridMetricas(),
              const SizedBox(height: 14),
              _EtiquetaSeccion('ACCIONES RÁPIDAS'),
              const SizedBox(height: 8),
              _AccionesRapidas(
                acciones: [
                  _AccionRapida(
                    icono: Icons.shopping_bag_outlined,
                    titulo: 'Comprar paquetes',
                    subtitulo: 'Recarga envíos prepagados',
                    fondoIcono: const Color(0xFFDBEAFE),
                    colorIcono: const Color(0xFF1D4ED8),
                    alTocar: () => context.push('/paquetes/tienda'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

String _iniciales(String texto) {
  final palabras = texto.trim().split(RegExp(r'\s+'));
  if (palabras.isEmpty || palabras.first.isEmpty) return '··';
  if (palabras.length == 1) {
    final p = palabras.first;
    return (p.length >= 2 ? p.substring(0, 2) : p).toUpperCase();
  }
  return (palabras.first[0] + palabras.last[0]).toUpperCase();
}

String _subtituloDesde(String? direccion) {
  if (direccion == null || direccion.trim().isEmpty) return 'Vendedor';
  final ciudad = direccion.split(',').last.trim();
  if (ciudad.isEmpty) return 'Vendedor';
  return 'Vendedor · $ciudad';
}

class _AppBarInicio extends StatelessWidget implements PreferredSizeWidget {
  const _AppBarInicio({
    required this.iniciales,
    required this.titulo,
    required this.subtitulo,
    required this.alPresionarCampana,
  });

  final String iniciales;
  final String titulo;
  final String subtitulo;
  final VoidCallback alPresionarCampana;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: 64,
      backgroundColor: tokens(context).fondo,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      leadingWidth: 60,
      leading: Padding(
        padding: const EdgeInsets.only(left: 16),
        child: Center(
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: tokens(context).verdeSuave,
            ),
            alignment: Alignment.center,
            child: Text(
              iniciales,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: tokens(context).verdeTinta,
                height: 1,
              ),
            ),
          ),
        ),
      ),
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            titulo,
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: tokens(context).tinta,
              letterSpacing: -0.2,
              height: 1.2,
            ),
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            subtitulo,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: tokens(context).tintaSilenciada,
              height: 1.3,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 8),
          child: IconButton(
            tooltip: 'Notificaciones',
            icon: Icon(
              Icons.notifications_outlined,
              size: 22,
              color: tokens(context).tinta,
            ),
            onPressed: alPresionarCampana,
          ),
        ),
      ],
    );
  }
}

class _HeroNuevoPedido extends StatelessWidget {
  const _HeroNuevoPedido();

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(TokensRapix.radioXl),
        boxShadow: TokensRapix.sombraSm,
      ),
      child: Material(
        color: TokensRapix.verde,
        borderRadius: BorderRadius.circular(TokensRapix.radioXl),
        child: InkWell(
          onTap: () => context.push('/pedidos/nuevo'),
          borderRadius: BorderRadius.circular(TokensRapix.radioXl),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: const Color(0x33FFFFFF),
                    borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                  ),
                  alignment: Alignment.center,
                  child: const Icon(
                    Icons.add_box_rounded,
                    size: 28,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Nuevo pedido',
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: -0.3,
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Crea un envío para tus clientes',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xD9FFFFFF),
                          height: 1.3,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                const Icon(
                  Icons.arrow_forward_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SaldoStrip extends ConsumerWidget {
  const _SaldoStrip();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saldo = ref.watch(saldoProvider);

    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        border: Border.all(color: tokens(context).contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: saldo.when(
        data: (s) => _SaldoStripFila(
          envios: s.saldoRecargado,
          paquetesActivos: s.paquetesActivos,
          alTocarStrip: () => context.push('/paquetes'),
          alRecargar: () => context.push('/paquetes/tienda'),
        ),
        loading: () => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          child: Row(
            children: [
              Icon(
                Icons.account_balance_wallet_outlined,
                size: 18,
                color: tokens(context).tintaSilenciada,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  height: 10,
                  decoration: BoxDecoration(
                    color: tokens(context).superficieHundida,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ],
          ),
        ),
        error: (_, _) => InkWell(
          onTap: () => ref.invalidate(saldoProvider),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 18,
                  color: TokensRapix.peligro,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Saldo no disponible',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: tokens(context).tintaSilenciada,
                    ),
                  ),
                ),
                Text(
                  'Reintentar',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: TokensRapix.verde,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SaldoStripFila extends StatelessWidget {
  const _SaldoStripFila({
    required this.envios,
    required this.paquetesActivos,
    required this.alTocarStrip,
    required this.alRecargar,
  });

  final int envios;
  final int paquetesActivos;
  final VoidCallback alTocarStrip;
  final VoidCallback alRecargar;

  @override
  Widget build(BuildContext context) {
    final envioTxt = envios == 1 ? 'envío' : 'envíos';
    final paqueteTxt = paquetesActivos == 1 ? 'paquete' : 'paquetes';

    return InkWell(
      onTap: alTocarStrip,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            const Icon(
              Icons.account_balance_wallet_outlined,
              size: 18,
              color: TokensRapix.verdeOscuro,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: '$envios ',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: tokens(context).tinta,
                      ),
                    ),
                    TextSpan(
                      text: '$envioTxt · ',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: tokens(context).tintaSilenciada,
                      ),
                    ),
                    TextSpan(
                      text: '$paquetesActivos ',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: tokens(context).tinta,
                      ),
                    ),
                    TextSpan(
                      text: paqueteTxt,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: tokens(context).tintaSilenciada,
                      ),
                    ),
                  ],
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            InkWell(
              onTap: alRecargar,
              borderRadius: BorderRadius.circular(TokensRapix.radioSm),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 6,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Recargar',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: TokensRapix.verde,
                      ),
                    ),
                    const SizedBox(width: 2),
                    const Icon(
                      Icons.arrow_forward_rounded,
                      size: 14,
                      color: TokensRapix.verde,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GridMetricas extends ConsumerWidget {
  const _GridMetricas();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final metricas = ref.watch(_metricasInicioProvider);
    return metricas.when(
      data: (m) {
        final tarjetas = [
          _TarjetaMetrica(
            etiqueta: 'En tránsito',
            valor: m.enTransito,
            icono: Icons.local_shipping_outlined,
            estados: TokensRapix.estados['EN_TRANSITO']!,
          ),
          _TarjetaMetrica(
            etiqueta: 'Entregados hoy',
            valor: m.entregadosHoy,
            icono: Icons.check_circle_outline,
            estados: TokensRapix.estados['ENTREGADO']!,
          ),
          _TarjetaMetrica(
            etiqueta: 'Pendientes',
            valor: m.pendientes,
            icono: Icons.schedule_outlined,
            estados: TokensRapix.estados['PENDIENTE_ASIGNACION']!,
          ),
          _TarjetaMetrica(
            etiqueta: 'Esta semana',
            valor: m.estaSemana,
            icono: Icons.trending_up,
            estados: TokensRapix.estados['ASIGNADO']!,
          ),
        ];
        return _GridDosColumnas(
          children: tarjetas,
        );
      },
      loading: () => _GridDosColumnas(
        children: List.generate(4, (_) => const _TarjetaMetricaPlaceholder()),
      ),
      error: (_, _) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: tokens(context).superficie,
          borderRadius: BorderRadius.circular(TokensRapix.radioLg),
          border: Border.all(color: tokens(context).contorno),
        ),
        child: Row(
          children: [
            const Icon(
              Icons.error_outline,
              color: TokensRapix.peligro,
              size: 18,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'No se pudieron cargar las métricas',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: tokens(context).tintaSilenciada,
                ),
              ),
            ),
            TextButton(
              onPressed: () => ref.invalidate(_metricasInicioProvider),
              child: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}

class _GridDosColumnas extends StatelessWidget {
  const _GridDosColumnas({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final filas = <Widget>[];
    for (var i = 0; i < children.length; i += 2) {
      final izquierda = children[i];
      final derecha = i + 1 < children.length ? children[i + 1] : null;
      filas.add(
        Padding(
          padding: EdgeInsets.only(top: i == 0 ? 0 : 10),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(child: izquierda),
                const SizedBox(width: 10),
                Expanded(
                  child: derecha ?? const SizedBox.shrink(),
                ),
              ],
            ),
          ),
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: filas,
    );
  }
}

class _TarjetaMetrica extends StatelessWidget {
  const _TarjetaMetrica({
    required this.etiqueta,
    required this.valor,
    required this.icono,
    required this.estados,
  });

  final String etiqueta;
  final int valor;
  final IconData icono;
  final EstadoColores estados;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: estados.fondo,
              borderRadius: BorderRadius.circular(TokensRapix.radioSm),
            ),
            alignment: Alignment.center,
            child: Icon(icono, size: 16, color: estados.texto),
          ),
          const SizedBox(height: 8),
          Text(
            '$valor',
            style: GoogleFonts.inter(
              fontSize: 24,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.5,
              color: tokens(context).tinta,
              height: 1,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            etiqueta,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: tokens(context).tintaSilenciada,
            ),
          ),
        ],
      ),
    );
  }
}

class _TarjetaMetricaPlaceholder extends StatelessWidget {
  const _TarjetaMetricaPlaceholder();

  @override
  Widget build(BuildContext context) {
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
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: tokens(context).superficieHundida,
              borderRadius: BorderRadius.circular(TokensRapix.radioSm),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: 36,
            height: 22,
            decoration: BoxDecoration(
              color: tokens(context).superficieHundida,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          const SizedBox(height: 6),
          Container(
            width: 70,
            height: 12,
            decoration: BoxDecoration(
              color: tokens(context).superficieHundida,
              borderRadius: BorderRadius.circular(4),
            ),
          ),
        ],
      ),
    );
  }
}

class _EtiquetaSeccion extends StatelessWidget {
  const _EtiquetaSeccion(this.texto);

  final String texto;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Text(
        texto,
        style: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: tokens(context).tintaSilenciada,
          letterSpacing: 0.6,
        ),
      ),
    );
  }
}

class _AccionRapida {
  const _AccionRapida({
    required this.icono,
    required this.titulo,
    required this.subtitulo,
    required this.fondoIcono,
    required this.colorIcono,
    required this.alTocar,
  });

  final IconData icono;
  final String titulo;
  final String subtitulo;
  final Color fondoIcono;
  final Color colorIcono;
  final VoidCallback alTocar;
}

class _AccionesRapidas extends StatelessWidget {
  const _AccionesRapidas({required this.acciones});

  final List<_AccionRapida> acciones;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          for (var i = 0; i < acciones.length; i++)
            _FilaAccion(
              accion: acciones[i],
              ultima: i == acciones.length - 1,
            ),
        ],
      ),
    );
  }
}

class _FilaAccion extends StatelessWidget {
  const _FilaAccion({required this.accion, required this.ultima});

  final _AccionRapida accion;
  final bool ultima;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: accion.alTocar,
      child: Container(
        decoration: BoxDecoration(
          border: ultima
              ? null
              : Border(
                  bottom: BorderSide(color: tokens(context).contornoSuave),
                ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: accion.fondoIcono,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              alignment: Alignment.center,
              child: Icon(accion.icono, size: 22, color: accion.colorIcono),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    accion.titulo,
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: tokens(context).tinta,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    accion.subtitulo,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: tokens(context).tintaSilenciada,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              size: 20,
              color: tokens(context).tintaSuave,
            ),
          ],
        ),
      ),
    );
  }
}
