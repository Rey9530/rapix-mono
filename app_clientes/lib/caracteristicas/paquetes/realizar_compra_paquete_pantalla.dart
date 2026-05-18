import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import '../../datos/modelos/paquete_recargado.dart';
import '../../datos/repositorios/paquetes_repositorio.dart';
import '../../nucleo/config/datos_bancarios.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import 'paquetes_controlador.dart';

class RealizarCompraPaquetePantalla extends ConsumerStatefulWidget {
  const RealizarCompraPaquetePantalla({super.key, required this.regla});

  final ReglaTarifaPaquete regla;

  @override
  ConsumerState<RealizarCompraPaquetePantalla> createState() =>
      _RealizarCompraPaquetePantallaState();
}

class _RealizarCompraPaquetePantallaState
    extends ConsumerState<RealizarCompraPaquetePantalla> {
  final _selectorImagen = ImagePicker();
  final _controladorPaginas = PageController();
  XFile? _comprobante;
  int _paso = 0;
  bool _enviando = false;

  @override
  void dispose() {
    _controladorPaginas.dispose();
    super.dispose();
  }

  void _irAPaso(int paso) {
    setState(() => _paso = paso);
    _controladorPaginas.animateToPage(
      paso,
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
    );
  }

  Future<void> _elegirComprobante() async {
    final origen = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: tokens(context).superficie,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: tokens(context).contorno,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.photo_camera_outlined),
              title: const Text('Tomar foto'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Elegir de galeria'),
              onTap: () => Navigator.pop(ctx, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (origen == null) return;
    try {
      final imagen = await _selectorImagen.pickImage(
        source: origen,
        maxWidth: 1600,
        imageQuality: 80,
      );
      if (imagen != null) {
        setState(() => _comprobante = imagen);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo abrir el selector: $e')),
      );
    }
  }

  Future<void> _enviar() async {
    if (_comprobante == null || _enviando) return;
    setState(() => _enviando = true);
    try {
      final paquete = await ref.read(paquetesRepositorioProvider).comprar(
            reglaTarifaId: widget.regla.id,
            metodoPago: 'TRANSFERENCIA',
            comprobante: _comprobante,
          );
      ref.invalidate(misPaquetesProvider);
      ref.invalidate(saldoProvider);
      if (!mounted) return;
      context.go('/paquetes/tienda/exito', extra: paquete);
    } on DioException catch (e) {
      if (!mounted) return;
      final data = e.response?.data;
      final mensaje = data is Map<String, dynamic>
          ? (data['mensaje'] ?? data['message'])?.toString()
          : null;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(mensaje ?? 'No se pudo procesar la compra')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error inesperado: $e')),
      );
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final formato = NumberFormat.currency(symbol: '\$');
    return Scaffold(
      appBar: AppBar(
        title: const Text('Comprar paquete'),
        leading: _paso == 1
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => _irAPaso(0),
              )
            : null,
      ),
      body: Column(
        children: [
          _IndicadorPasos(pasoActual: _paso),
          Expanded(
            child: PageView(
              controller: _controladorPaginas,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _PasoInstrucciones(
                  regla: widget.regla,
                  formato: formato,
                  alContinuar: () => _irAPaso(1),
                ),
                _PasoComprobante(
                  comprobante: _comprobante,
                  enviando: _enviando,
                  alElegir: _elegirComprobante,
                  alEnviar: _enviar,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _IndicadorPasos extends StatelessWidget {
  const _IndicadorPasos({required this.pasoActual});

  final int pasoActual;

  @override
  Widget build(BuildContext context) {
    final activo = Theme.of(context).colorScheme.primary;
    final inactivo = Theme.of(context).colorScheme.surfaceContainerHighest;
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 4,
              decoration: BoxDecoration(
                color: pasoActual >= 0 ? activo : inactivo,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Container(
              height: 4,
              decoration: BoxDecoration(
                color: pasoActual >= 1 ? activo : inactivo,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            'Paso ${pasoActual + 1} de 2',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}

class _PasoInstrucciones extends StatelessWidget {
  const _PasoInstrucciones({
    required this.regla,
    required this.formato,
    required this.alContinuar,
  });

  final ReglaTarifaPaquete regla;
  final NumberFormat formato;
  final VoidCallback alContinuar;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Realiza la transferencia',
            style: t.textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Para comprar "${regla.nombre}" por ${formato.format(regla.precioPaquete)}, '
            'hace la transferencia a la cuenta indicada por el monto exacto. '
            'Cuando termines, toca Siguiente para adjuntar el comprobante.',
            style: t.textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.account_balance, color: t.colorScheme.primary),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Datos para la transferencia',
                          style: t.textTheme.titleMedium,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    DatosBancariosCompra.etiquetaPlaceholder,
                    style: t.textTheme.bodySmall?.copyWith(
                      color: t.colorScheme.error,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 12),
                  _FilaDato(etiqueta: 'Banco', valor: DatosBancariosCompra.banco),
                  _FilaDato(
                    etiqueta: 'Tipo de cuenta',
                    valor: DatosBancariosCompra.tipoCuenta,
                  ),
                  _FilaDato(
                    etiqueta: 'N° de cuenta',
                    valor: DatosBancariosCompra.numeroCuenta,
                    copiable: true,
                  ),
                  _FilaDato(
                    etiqueta: 'Titular',
                    valor: DatosBancariosCompra.titular,
                  ),
                  const Divider(height: 24),
                  _FilaDato(
                    etiqueta: 'Monto a transferir',
                    valor: formato.format(regla.precioPaquete),
                    destacado: true,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: alContinuar,
            icon: const Icon(Icons.arrow_forward),
            label: const Text('Ya hice la transferencia, siguiente'),
          ),
        ],
      ),
    );
  }
}

class _FilaDato extends StatelessWidget {
  const _FilaDato({
    required this.etiqueta,
    required this.valor,
    this.copiable = false,
    this.destacado = false,
  });

  final String etiqueta;
  final String valor;
  final bool copiable;
  final bool destacado;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    final estiloValor = destacado
        ? t.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: t.colorScheme.primary,
          )
        : t.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(etiqueta, style: t.textTheme.bodySmall),
          ),
          Expanded(child: Text(valor, style: estiloValor)),
          if (copiable)
            IconButton(
              tooltip: 'Copiar',
              icon: const Icon(Icons.copy, size: 18),
              visualDensity: VisualDensity.compact,
              onPressed: () {
                Clipboard.setData(ClipboardData(text: valor));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Copiado al portapapeles')),
                );
              },
            ),
        ],
      ),
    );
  }
}

class _PasoComprobante extends StatelessWidget {
  const _PasoComprobante({
    required this.comprobante,
    required this.enviando,
    required this.alElegir,
    required this.alEnviar,
  });

  final XFile? comprobante;
  final bool enviando;
  final VoidCallback alElegir;
  final VoidCallback alEnviar;

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Adjunta tu comprobante',
            style: t.textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'Subi una foto clara del comprobante de transferencia. '
            'El admin la revisara para activar tu paquete.',
            style: t.textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          GestureDetector(
            onTap: enviando ? null : alElegir,
            child: Container(
              height: 320,
              decoration: BoxDecoration(
                color: t.colorScheme.surfaceContainerHighest,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: t.colorScheme.outline,
                  style: BorderStyle.solid,
                ),
              ),
              child: comprobante == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.add_a_photo_outlined,
                          size: 56,
                          color: t.colorScheme.primary,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Toca para adjuntar tu comprobante',
                          style: t.textTheme.bodyLarge,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Camara o galeria',
                          style: t.textTheme.bodySmall,
                        ),
                      ],
                    )
                  : ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.file(
                        File(comprobante!.path),
                        fit: BoxFit.cover,
                        width: double.infinity,
                      ),
                    ),
            ),
          ),
          if (comprobante != null) ...[
            const SizedBox(height: 8),
            TextButton.icon(
              onPressed: enviando ? null : alElegir,
              icon: const Icon(Icons.refresh),
              label: const Text('Reemplazar imagen'),
            ),
          ],
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: (comprobante == null || enviando) ? null : alEnviar,
            icon: enviando
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : const Icon(Icons.send),
            label: Text(enviando ? 'Enviando...' : 'Enviar comprobante'),
          ),
        ],
      ),
    );
  }
}

