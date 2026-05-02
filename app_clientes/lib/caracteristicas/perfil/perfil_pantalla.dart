import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../datos/modelos/usuario.dart';
import '../../nucleo/tema/tokens_rapix.dart';
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

    return Scaffold(
      backgroundColor: TokensRapix.fondo,
      body: Column(
        children: [
          _HeroOscuro(usuario: usuario),
          Expanded(child: _SheetClara(usuario: usuario)),
        ],
      ),
    );
  }
}

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
                          const SizedBox(height: 6),
                          // TODO: integrar con backend (rating y fechaRegistro
                          // del vendedor). Hoy se muestran placeholders.
                          Row(
                            children: [
                              const Icon(
                                Icons.star_rounded,
                                size: 14,
                                color: TokensRapix.ambar,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '4.8',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Flexible(
                                child: Text(
                                  '· miembro desde mar 2024',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    color:
                                        Colors.white.withValues(alpha: 0.6),
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                // TODO: integrar con backend (envíos totales,
                // porcentaje de entregados, saldo del vendedor).
                child: _StatsGrid(),
              ),
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
  const _StatsGrid();

  @override
  Widget build(BuildContext context) {
    return const Row(
      children: [
        Expanded(child: _StatItem(valor: '247', etiqueta: 'Envíos totales')),
        SizedBox(width: 10),
        Expanded(child: _StatItem(valor: '98%', etiqueta: 'Entregados')),
        SizedBox(width: 10),
        Expanded(child: _StatItem(valor: '34', etiqueta: 'Saldo')),
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
    return Transform.translate(
      offset: const Offset(0, -16),
      child: Container(
        decoration: const BoxDecoration(
          color: TokensRapix.fondo,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(28),
            topRight: Radius.circular(28),
          ),
        ),
        clipBehavior: Clip.antiAlias,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
          children: [
            if (perfilVendedor != null) ...[
              _CardNegocio(perfil: perfilVendedor),
              const SizedBox(height: 12),
            ],
            const _GridAccesos(),
            const SizedBox(height: 12),
            _CardCuenta(usuario: usuario),
            const SizedBox(height: 12),
            _BotonLogout(
              onTap: () => _confirmarCerrarSesion(context, ref),
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
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: TokensRapix.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioXl),
        border: Border.all(color: TokensRapix.contorno),
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
                  color: TokensRapix.verdeSuave,
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
                        color: TokensRapix.tintaSilenciada,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      perfil.nombreNegocio ?? 'Sin nombre',
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.2,
                        color: TokensRapix.tinta,
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
              padding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 10,
              ),
              decoration: BoxDecoration(
                color: TokensRapix.superficieAlt,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    size: 14,
                    color: TokensRapix.tintaSilenciada,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      perfil.direccion!,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: TokensRapix.tinta,
                      ),
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
              padding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 10,
              ),
              decoration: BoxDecoration(
                color: TokensRapix.superficieAlt,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.map_outlined,
                    size: 14,
                    color: TokensRapix.tintaSilenciada,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '${perfil.latitud!.toStringAsFixed(5)}, ${perfil.longitud!.toStringAsFixed(5)}',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: TokensRapix.tinta,
                      ),
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

class _GridAccesos extends StatelessWidget {
  const _GridAccesos();

  @override
  Widget build(BuildContext context) {
    const accesos = <_AccesoData>[
      _AccesoData(
        icono: Icons.notifications_outlined,
        titulo: 'Notificaciones',
        subtitulo: '3 nuevas',
      ),
      _AccesoData(
        icono: Icons.account_balance_wallet_outlined,
        titulo: 'Pagos',
        subtitulo: 'BAC •• 4456',
      ),
      _AccesoData(
        icono: Icons.inventory_2_outlined,
        titulo: 'Mis paquetes',
        subtitulo: '2 activos',
      ),
      _AccesoData(
        icono: Icons.help_outline_rounded,
        titulo: 'Ayuda',
        subtitulo: 'WhatsApp 24/7',
      ),
    ];

    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _AccesoTile(data: accesos[0])),
            const SizedBox(width: 10),
            Expanded(child: _AccesoTile(data: accesos[1])),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: _AccesoTile(data: accesos[2])),
            const SizedBox(width: 10),
            Expanded(child: _AccesoTile(data: accesos[3])),
          ],
        ),
      ],
    );
  }
}

class _AccesoData {
  const _AccesoData({
    required this.icono,
    required this.titulo,
    required this.subtitulo,
  });

  final IconData icono;
  final String titulo;
  final String subtitulo;
}

class _AccesoTile extends StatelessWidget {
  const _AccesoTile({required this.data});

  final _AccesoData data;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: TokensRapix.superficie,
      borderRadius: BorderRadius.circular(TokensRapix.radioLg),
      child: InkWell(
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        onTap: () => _mostrarProximamente(context),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(TokensRapix.radioLg),
            border: Border.all(color: TokensRapix.contorno),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: TokensRapix.superficieAlt,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Icon(data.icono, size: 18, color: TokensRapix.tinta),
              ),
              const SizedBox(height: 10),
              Text(
                data.titulo,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                  color: TokensRapix.tinta,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                data.subtitulo,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: TokensRapix.tintaSilenciada,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
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
    final filas = <_CuentaFila>[
      _CuentaFila(etiqueta: 'Correo', valor: usuario.email),
      _CuentaFila(etiqueta: 'Teléfono', valor: usuario.telefono),
      const _CuentaFila(etiqueta: 'Contraseña', valor: '••••••••'),
    ];

    return Container(
      decoration: BoxDecoration(
        color: TokensRapix.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: TokensRapix.contorno),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          for (int i = 0; i < filas.length; i++) ...[
            _CuentaFilaTile(fila: filas[i]),
            if (i < filas.length - 1)
              const Divider(
                height: 1,
                thickness: 1,
                color: TokensRapix.contornoSuave,
              ),
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
                      color: TokensRapix.tintaSilenciada,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    fila.valor,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: TokensRapix.tinta,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              Icons.chevron_right_rounded,
              size: 20,
              color: TokensRapix.tintaSuave,
            ),
          ],
        ),
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
            border: Border.all(color: TokensRapix.peligroSuave),
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
          style: FilledButton.styleFrom(
            backgroundColor: TokensRapix.peligro,
          ),
          child: const Text('Cerrar sesión'),
        ),
      ],
    ),
  );
  if (confirmado != true) return;
  await ref.read(autenticacionControladorProvider.notifier).cerrarSesion();
  if (context.mounted) context.go('/iniciar-sesion');
}
