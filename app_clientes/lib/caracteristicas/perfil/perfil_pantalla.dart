import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../datos/modelos/usuario.dart';
import '../../nucleo/tema/proveedor_tema.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import '../../nucleo/util/fechas.dart';
import '../autenticacion/autenticacion_controlador.dart';
import 'cuentas_bancarias/cuentas_bancarias_controlador.dart';

class PerfilPantalla extends ConsumerWidget {
  const PerfilPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final estado = ref.watch(autenticacionControladorProvider);
    final usuario = estado.usuario;

    if (usuario == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      backgroundColor: tokens(context).fondo,
      body: Column(
        children: [
          _HeroOscuro(usuario: usuario),
          Expanded(child: _SheetClara(usuario: usuario)),
        ],
      ),
    );
  }
}

// El hero superior es un bloque oscuro intencional del diseno (siempre se
// muestra con paleta dark sobre cualquier tema), por eso usa colores
// hardcoded de TokensRapix y `Colors.white` directamente.
class _HeroOscuro extends StatelessWidget {
  const _HeroOscuro({required this.usuario});

  final Usuario usuario;

  @override
  Widget build(BuildContext context) {
    final perfilVendedor = usuario.perfilVendedor;
    final inicial = usuario.nombreCompleto.trim().isNotEmpty
        ? usuario.nombreCompleto.trim()[0].toUpperCase()
        : '?';

    final subtitulo = perfilVendedor?.nombreNegocio?.trim().isNotEmpty == true
        ? perfilVendedor!.nombreNegocio!
        : usuario.rol;

    final desde = usuario.creadoEn != null
        ? miembroDesde(usuario.creadoEn!)
        : null;

    return Container(
      color: TokensRapix.tinta,
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(8, 4, 8, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _BarraAcciones(usuario: usuario),
              const SizedBox(height: 4),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    _AvatarHero(inicial: inicial),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            usuario.nombreCompleto,
                            style: GoogleFonts.inter(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              letterSpacing: -0.6,
                              color: Colors.white,
                              height: 1.1,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            subtitulo,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.white.withValues(alpha: 0.7),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          if (desde != null) ...[
                            const SizedBox(height: 6),
                            Text(
                              desde,
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: Colors.white.withValues(alpha: 0.6),
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              if (usuario.estadisticas != null) ...[
                const SizedBox(height: 18),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _StatsGrid(estadisticas: usuario.estadisticas!),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _BarraAcciones extends ConsumerWidget {
  const _BarraAcciones({required this.usuario});

  final Usuario usuario;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final puedeEditar = usuario.perfilVendedor != null;
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        if (puedeEditar)
          IconButton(
            onPressed: () => context.push('/perfil/editar-negocio'),
            icon: const Icon(Icons.edit_outlined, color: Colors.white),
            tooltip: 'Editar negocio',
          ),
        IconButton(
          onPressed: () => _confirmarCerrarSesion(context, ref),
          icon: const Icon(Icons.logout_rounded, color: Colors.white),
          tooltip: 'Cerrar sesión',
        ),
      ],
    );
  }
}

class _AvatarHero extends StatelessWidget {
  const _AvatarHero({required this.inicial});

  final String inicial;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 72,
      height: 72,
      decoration: BoxDecoration(
        color: TokensRapix.verde,
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.15),
          width: 3,
        ),
      ),
      alignment: Alignment.center,
      child: Text(
        inicial,
        style: GoogleFonts.inter(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          letterSpacing: -1,
          color: Colors.white,
        ),
      ),
    );
  }
}

class _StatsGrid extends StatelessWidget {
  const _StatsGrid({required this.estadisticas});

  final EstadisticasUsuario estadisticas;

  @override
  Widget build(BuildContext context) {
    final pct = estadisticas.porcentajeEntregados;
    final entregadosLabel = pct == null ? '—' : '${pct.round()}%';
    return Row(
      children: [
        Expanded(
          child: _StatItem(
            valor: estadisticas.enviosTotales.toString(),
            etiqueta: 'Envíos totales',
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatItem(valor: entregadosLabel, etiqueta: 'Entregados'),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _StatItem(
            valor: estadisticas.saldoRecargado.toString(),
            etiqueta: 'Saldo',
          ),
        ),
      ],
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({required this.valor, required this.etiqueta});

  final String valor;
  final String etiqueta;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            valor,
            style: GoogleFonts.inter(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              letterSpacing: -0.7,
              height: 1,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            etiqueta.toUpperCase(),
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.4,
              color: Colors.white.withValues(alpha: 0.65),
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _SheetClara extends ConsumerWidget {
  const _SheetClara({required this.usuario});

  final Usuario usuario;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final perfilVendedor = usuario.perfilVendedor;
    final t = tokens(context);
    return Transform.translate(
      offset: const Offset(0, -16),
      child: Container(
        decoration: BoxDecoration(
          color: t.fondo,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(28),
            topRight: Radius.circular(28),
          ),
        ),
        clipBehavior: Clip.antiAlias,
        child: RefreshIndicator(
          color: TokensRapix.verde,
          onRefresh: () => ref
              .read(autenticacionControladorProvider.notifier)
              .recargarUsuario(),
          child: ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
            children: [
              _BannerCorreoVerificacion(usuario: usuario),
              if (perfilVendedor != null) ...[
                _CardNegocio(perfil: perfilVendedor),
                const SizedBox(height: 12),
              ],
              _ListaAccesos(esVendedor: usuario.rol == 'VENDEDOR'),
              const SizedBox(height: 12),
              _CardCuenta(usuario: usuario),
              const SizedBox(height: 12),
              const _CardPreferencias(),
              const SizedBox(height: 12),
              _BotonLogout(onTap: () => _confirmarCerrarSesion(context, ref)),
            ],
          ),
        ),
      ),
    );
  }
}

class _BannerCorreoVerificacion extends ConsumerStatefulWidget {
  const _BannerCorreoVerificacion({required this.usuario});

  final Usuario usuario;

  @override
  ConsumerState<_BannerCorreoVerificacion> createState() =>
      _BannerCorreoVerificacionState();
}

class _BannerCorreoVerificacionState
    extends ConsumerState<_BannerCorreoVerificacion> {
  bool _enviando = false;

  Future<void> _reenviar() async {
    if (_enviando) return;
    setState(() => _enviando = true);
    final messenger = ScaffoldMessenger.of(context);
    try {
      await ref
          .read(autenticacionControladorProvider.notifier)
          .reenviarVerificacionCorreo();
      if (!mounted) return;
      messenger
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('Te enviamos un correo de verificación.'),
            duration: Duration(seconds: 3),
          ),
        );
    } catch (_) {
      if (!mounted) return;
      messenger
        ..hideCurrentSnackBar()
        ..showSnackBar(
          const SnackBar(
            content: Text('No se pudo enviar el correo. Intenta de nuevo.'),
            duration: Duration(seconds: 3),
          ),
        );
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    if (widget.usuario.correoVerificado) {
      // Verificado: chip discreto verde, sin acción.
      return Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: t.verdeSuave,
            borderRadius: BorderRadius.circular(TokensRapix.radioMd),
            border: Border.all(color: t.contornoSuave),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.verified_rounded,
                size: 18,
                color: TokensRapix.verdeOscuro,
              ),
              const SizedBox(width: 8),
              Text(
                'Correo verificado',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: TokensRapix.verdeOscuro,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // No verificado: banner llamativo con botón de reenvío.
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 12, 8, 12),
        decoration: BoxDecoration(
          color: t.peligroSuave,
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          border: Border.all(color: TokensRapix.peligro.withValues(alpha: 0.3)),
        ),
        child: Row(
          children: [
            const Icon(
              Icons.mark_email_unread_outlined,
              size: 20,
              color: TokensRapix.peligro,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Correo sin verificar',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: TokensRapix.peligro,
                    ),
                  ),
                  Text(
                    widget.usuario.email,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: t.tintaSilenciada,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: _enviando ? null : _reenviar,
              child: _enviando
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: TokensRapix.peligro,
                      ),
                    )
                  : Text(
                      'Reenviar',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: TokensRapix.peligro,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CardNegocio extends StatelessWidget {
  const _CardNegocio({required this.perfil});

  final PerfilVendedor perfil;

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: t.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioXl),
        border: Border.all(color: t.contorno),
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: t.verdeSuave,
                  borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.storefront_outlined,
                  size: 20,
                  color: TokensRapix.verdeOscuro,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TU NEGOCIO',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.4,
                        color: t.tintaSilenciada,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      perfil.nombreNegocio ?? 'Sin nombre',
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                        color: t.tinta,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              InkWell(
                onTap: () => context.push('/perfil/editar-negocio'),
                borderRadius: BorderRadius.circular(TokensRapix.radioSm),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 6,
                  ),
                  child: Text(
                    'Editar',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: TokensRapix.verde,
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (perfil.direccion != null) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: t.superficieAlt,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.location_on_outlined,
                    size: 14,
                    color: t.tintaSilenciada,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      perfil.direccion!,
                      style: GoogleFonts.inter(fontSize: 12, color: t.tinta),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ],
          if (perfil.latitud != null && perfil.longitud != null) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: t.superficieAlt,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              child: Row(
                children: [
                  Icon(Icons.map_outlined, size: 14, color: t.tintaSilenciada),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '${perfil.latitud!.toStringAsFixed(5)}, ${perfil.longitud!.toStringAsFixed(5)}',
                      style: GoogleFonts.inter(fontSize: 12, color: t.tinta),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ListaAccesos extends ConsumerWidget {
  const _ListaAccesos({required this.esVendedor});

  final bool esVendedor;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = tokens(context);
    final items = <_AccesoItem>[
      if (esVendedor)
        _AccesoItem(
          icono: Icons.account_balance_outlined,
          titulo: 'Datos bancarios',
          subtituloBuilder: (ctx, ref) => _resumenCuentasBancarias(ref),
          onTap: (ctx) => ctx.push('/perfil/cuentas-bancarias'),
        ),
      _AccesoItem(
        icono: Icons.notifications_outlined,
        titulo: 'Notificaciones',
        subtitulo: '3 nuevas',
        onTap: (ctx) => _mostrarProximamente(ctx),
      ),
      _AccesoItem(
        icono: Icons.account_balance_wallet_outlined,
        titulo: 'Pagos',
        subtitulo: 'BAC •• 4456',
        onTap: (ctx) => _mostrarProximamente(ctx),
      ),
      _AccesoItem(
        icono: Icons.inventory_2_outlined,
        titulo: 'Mis paquetes',
        subtitulo: '2 activos',
        onTap: (ctx) => _mostrarProximamente(ctx),
      ),
      _AccesoItem(
        icono: Icons.help_outline_rounded,
        titulo: 'Ayuda',
        subtitulo: 'WhatsApp 24/7',
        onTap: (ctx) => _mostrarProximamente(ctx),
      ),
    ];

    return Container(
      decoration: BoxDecoration(
        color: t.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: t.contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          for (int i = 0; i < items.length; i++) ...[
            _AccesoFilaTile(item: items[i]),
            if (i < items.length - 1)
              Divider(
                height: 1,
                thickness: 1,
                color: t.contornoSuave,
                indent: 16,
                endIndent: 16,
              ),
          ],
        ],
      ),
    );
  }

  String _resumenCuentasBancarias(WidgetRef ref) {
    final async = ref.watch(cuentasBancariasProvider);
    return async.when(
      loading: () => 'Cargando...',
      error: (_, __) => 'No disponible',
      data: (lista) {
        if (lista.isEmpty) return 'Agregar cuenta bancaria';
        final principal = lista.firstWhere(
          (c) => c.esPrincipal,
          orElse: () => lista.first,
        );
        final etiqueta = principal.alias?.isNotEmpty == true
            ? principal.alias!
            : principal.banco.nombre;
        final extra = lista.length > 1 ? ' · +${lista.length - 1}' : '';
        return '$etiqueta · ${principal.numeroEnmascarado}$extra';
      },
    );
  }
}

class _AccesoItem {
  _AccesoItem({
    required this.icono,
    required this.titulo,
    this.subtitulo,
    this.subtituloBuilder,
    this.onTap,
  });

  final IconData icono;
  final String titulo;
  final String? subtitulo;
  final String Function(BuildContext, WidgetRef)? subtituloBuilder;
  final void Function(BuildContext context)? onTap;
}

class _AccesoFilaTile extends ConsumerWidget {
  const _AccesoFilaTile({required this.item});

  final _AccesoItem item;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = tokens(context);
    final subtitulo =
        item.subtituloBuilder?.call(context, ref) ?? item.subtitulo ?? '';

    return InkWell(
      onTap: item.onTap == null ? null : () => item.onTap!(context),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: t.verdeSuave,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              alignment: Alignment.center,
              child: Icon(item.icono, size: 20, color: TokensRapix.verdeOscuro),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.titulo,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.2,
                      color: t.tinta,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (subtitulo.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitulo,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: t.tintaSilenciada,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(Icons.chevron_right_rounded, size: 20, color: t.tintaSuave),
          ],
        ),
      ),
    );
  }
}

class _CardCuenta extends StatelessWidget {
  const _CardCuenta({required this.usuario});

  final Usuario usuario;

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    final filas = <_CuentaFila>[
      _CuentaFila(etiqueta: 'Correo', valor: usuario.email),
      _CuentaFila(etiqueta: 'Teléfono', valor: usuario.telefono ?? '—'),
      const _CuentaFila(etiqueta: 'Contraseña', valor: '••••••••'),
    ];

    return Container(
      decoration: BoxDecoration(
        color: t.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: t.contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          for (int i = 0; i < filas.length; i++) ...[
            _CuentaFilaTile(fila: filas[i]),
            if (i < filas.length - 1)
              Divider(height: 1, thickness: 1, color: t.contornoSuave),
          ],
        ],
      ),
    );
  }
}

class _CuentaFila {
  const _CuentaFila({required this.etiqueta, required this.valor});
  final String etiqueta;
  final String valor;
}

class _CuentaFilaTile extends StatelessWidget {
  const _CuentaFilaTile({required this.fila});

  final _CuentaFila fila;

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    return InkWell(
      onTap: () => _mostrarProximamente(context),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    fila.etiqueta,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: t.tintaSilenciada,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    fila.valor,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: t.tinta,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(Icons.chevron_right_rounded, size: 20, color: t.tintaSuave),
          ],
        ),
      ),
    );
  }
}

class _CardPreferencias extends ConsumerWidget {
  const _CardPreferencias();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = tokens(context);
    final modo = ref.watch(temaControladorProvider);
    final esOscuro = modo == ThemeMode.dark;
    return Container(
      decoration: BoxDecoration(
        color: t.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: t.contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: SwitchListTile.adaptive(
        value: esOscuro,
        activeThumbColor: TokensRapix.verde,
        onChanged: (valor) {
          ref
              .read(temaControladorProvider.notifier)
              .cambiar(valor ? ThemeMode.dark : ThemeMode.light);
        },
        secondary: Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: t.superficieAlt,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Icon(Icons.dark_mode_outlined, size: 18, color: t.tinta),
        ),
        title: Text(
          'Modo oscuro',
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: t.tinta,
          ),
        ),
        subtitle: Text(
          esOscuro ? 'Activado' : 'Desactivado',
          style: GoogleFonts.inter(fontSize: 11, color: t.tintaSilenciada),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      ),
    );
  }
}

class _BotonLogout extends StatelessWidget {
  const _BotonLogout({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: tokens(context).peligroSuave),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.logout_rounded,
                size: 16,
                color: TokensRapix.peligro,
              ),
              const SizedBox(width: 8),
              Text(
                'Cerrar sesión',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: TokensRapix.peligro,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

void _mostrarProximamente(BuildContext context) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(
      const SnackBar(
        content: Text('Próximamente'),
        duration: Duration(seconds: 2),
      ),
    );
}

Future<void> _confirmarCerrarSesion(BuildContext context, WidgetRef ref) async {
  final confirmado = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Cerrar sesión'),
      content: const Text('¿Seguro que quieres cerrar tu sesión?'),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(ctx).pop(false),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: () => Navigator.of(ctx).pop(true),
          style: FilledButton.styleFrom(backgroundColor: TokensRapix.peligro),
          child: const Text('Cerrar sesión'),
        ),
      ],
    ),
  );
  if (confirmado != true) return;
  await ref.read(autenticacionControladorProvider.notifier).cerrarSesion();
  await ref.read(temaControladorProvider.notifier).cambiar(ThemeMode.light);
  if (context.mounted) context.go('/iniciar-sesion');
}
