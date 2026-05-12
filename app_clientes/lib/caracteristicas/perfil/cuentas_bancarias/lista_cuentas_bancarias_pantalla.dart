import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../datos/modelos/cuenta_bancaria.dart';
import '../../../datos/repositorios/cuentas_bancarias_repositorio.dart';
import '../../../nucleo/tema/tokens_rapix.dart';
import 'cuentas_bancarias_controlador.dart';
import 'errores_cuentas_bancarias.dart';

class ListaCuentasBancariasPantalla extends ConsumerWidget {
  const ListaCuentasBancariasPantalla({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cuentasAsync = ref.watch(cuentasBancariasProvider);
    final t = tokens(context);

    return Scaffold(
      backgroundColor: t.fondo,
      appBar: AppBar(
        backgroundColor: t.fondo,
        elevation: 0,
        title: Text(
          'Datos bancarios',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: t.tinta,
          ),
        ),
        iconTheme: IconThemeData(color: t.tinta),
      ),
      floatingActionButton: cuentasAsync.maybeWhen(
        data: (lista) => lista.isEmpty
            ? null
            : FloatingActionButton.extended(
                onPressed: () => context.push('/perfil/cuentas-bancarias/nueva'),
                backgroundColor: TokensRapix.verde,
                icon: const Icon(Icons.add, color: Colors.white),
                label: Text(
                  'Agregar',
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
        orElse: () => null,
      ),
      body: cuentasAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorEstado(
          mensaje: formatearErrorCuenta(e),
          onReintentar: () => ref.invalidate(cuentasBancariasProvider),
        ),
        data: (lista) {
          if (lista.isEmpty) return const _EstadoVacio();
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(cuentasBancariasProvider);
              await ref.read(cuentasBancariasProvider.future);
            },
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
              itemCount: lista.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (_, i) => _TarjetaCuenta(cuenta: lista[i]),
            ),
          );
        },
      ),
    );
  }
}

class _EstadoVacio extends StatelessWidget {
  const _EstadoVacio();

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: t.verdeSuave,
                borderRadius: BorderRadius.circular(20),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.account_balance_outlined,
                size: 36,
                color: TokensRapix.verdeOscuro,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Sin cuentas bancarias',
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: t.tinta,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Agrega tu primera cuenta para recibir liquidaciones de tus pedidos.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 13,
                color: t.tintaSilenciada,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: () =>
                  context.push('/perfil/cuentas-bancarias/nueva'),
              style: FilledButton.styleFrom(
                backgroundColor: TokensRapix.verde,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 14,
                ),
              ),
              icon: const Icon(Icons.add, color: Colors.white),
              label: Text(
                'Agregar cuenta bancaria',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TarjetaCuenta extends ConsumerStatefulWidget {
  const _TarjetaCuenta({required this.cuenta});

  final CuentaBancaria cuenta;

  @override
  ConsumerState<_TarjetaCuenta> createState() => _TarjetaCuentaState();
}

class _TarjetaCuentaState extends ConsumerState<_TarjetaCuenta> {
  bool _revelar = false;

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    final c = widget.cuenta;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: t.superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: t.contorno),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
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
                  Icons.account_balance_outlined,
                  size: 20,
                  color: TokensRapix.verdeOscuro,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            c.banco.nombre,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: t.tinta,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (c.esPrincipal) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: t.verdeSuave,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'Principal',
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: TokensRapix.verdeOscuro,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      c.tipoCuenta.etiqueta,
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: t.tintaSilenciada,
                      ),
                    ),
                  ],
                ),
              ),
              _MenuAcciones(cuenta: c),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: t.superficieAlt,
              borderRadius: BorderRadius.circular(TokensRapix.radioMd),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    _revelar ? c.numeroCuenta : c.numeroEnmascarado,
                    style: GoogleFonts.robotoMono(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: t.tinta,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () => setState(() => _revelar = !_revelar),
                  icon: Icon(
                    _revelar
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    size: 18,
                    color: t.tintaSilenciada,
                  ),
                  tooltip: _revelar ? 'Ocultar' : 'Mostrar',
                ),
              ],
            ),
          ),
          if (c.alias != null && c.alias!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              c.alias!,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: t.tintaSilenciada,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _MenuAcciones extends ConsumerWidget {
  const _MenuAcciones({required this.cuenta});

  final CuentaBancaria cuenta;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = tokens(context);
    return PopupMenuButton<String>(
      icon: Icon(Icons.more_vert, color: t.tintaSilenciada),
      onSelected: (valor) async {
        switch (valor) {
          case 'editar':
            context.push('/perfil/cuentas-bancarias/${cuenta.id}/editar');
            break;
          case 'principal':
            await _marcarPrincipal(context, ref);
            break;
          case 'eliminar':
            await _confirmarEliminar(context, ref);
            break;
        }
      },
      itemBuilder: (_) => [
        const PopupMenuItem(value: 'editar', child: Text('Editar')),
        if (!cuenta.esPrincipal)
          const PopupMenuItem(
            value: 'principal',
            child: Text('Marcar como principal'),
          ),
        const PopupMenuItem(
          value: 'eliminar',
          child: Text(
            'Eliminar',
            style: TextStyle(color: TokensRapix.peligro),
          ),
        ),
      ],
    );
  }

  Future<void> _marcarPrincipal(BuildContext context, WidgetRef ref) async {
    final repo = ref.read(cuentasBancariasRepositorioProvider);
    try {
      await repo.actualizar(
        cuenta.id,
        ActualizarCuentaBancariaEntrada(esPrincipal: true),
      );
      ref.invalidate(cuentasBancariasProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cuenta marcada como principal')),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(formatearErrorCuenta(e))),
        );
      }
    }
  }

  Future<void> _confirmarEliminar(BuildContext context, WidgetRef ref) async {
    final confirmado = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Eliminar cuenta'),
        content: Text(
          '¿Seguro que quieres eliminar la cuenta de ${cuenta.banco.nombre}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: TokensRapix.peligro,
            ),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirmado != true) return;
    final repo = ref.read(cuentasBancariasRepositorioProvider);
    try {
      await repo.eliminar(cuenta.id);
      ref.invalidate(cuentasBancariasProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cuenta eliminada')),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(formatearErrorCuenta(e))),
        );
      }
    }
  }
}

class _ErrorEstado extends StatelessWidget {
  const _ErrorEstado({required this.mensaje, required this.onReintentar});

  final String mensaje;
  final VoidCallback onReintentar;

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline,
                size: 48, color: t.tintaSilenciada),
            const SizedBox(height: 12),
            Text(
              mensaje,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(fontSize: 14, color: t.tinta),
            ),
            const SizedBox(height: 16),
            OutlinedButton(
              onPressed: onReintentar,
              child: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}

