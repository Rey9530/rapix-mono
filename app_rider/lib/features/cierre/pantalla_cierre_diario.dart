import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/network/excepciones_api.dart';
import '../../core/proveedores_globales.dart';
import 'proveedor_cierre.dart';

class PantallaCierreDiario extends ConsumerStatefulWidget {
  const PantallaCierreDiario({super.key});

  @override
  ConsumerState<PantallaCierreDiario> createState() => _PantallaCierreDiarioEstado();
}

class _PantallaCierreDiarioEstado extends ConsumerState<PantallaCierreDiario> {
  final _ctrlMonto = TextEditingController();
  final _ctrlNotas = TextEditingController();
  File? _foto;
  bool _enviando = false;
  bool _bloqueadoPorCierreExistente = false;

  @override
  void dispose() {
    _ctrlMonto.dispose();
    _ctrlNotas.dispose();
    super.dispose();
  }

  Future<void> _capturarFoto() async {
    final imagen = await ImagePicker().pickImage(
      source: ImageSource.camera,
      maxWidth: 1600,
      imageQuality: 80,
    );
    if (imagen != null) setState(() => _foto = File(imagen.path));
  }

  Future<void> _enviar() async {
    if (_foto == null || _ctrlMonto.text.trim().isEmpty) return;
    final monto = double.tryParse(_ctrlMonto.text.trim().replaceAll(',', '.'));
    if (monto == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Monto inválido'), backgroundColor: Colors.red),
      );
      return;
    }

    setState(() => _enviando = true);
    final messenger = ScaffoldMessenger.of(context);

    try {
      await ref.read(cierresRepositorioProveedor).crear(
            montoReportado: monto,
            comprobante: _foto!,
            notas: _ctrlNotas.text.trim().isEmpty ? null : _ctrlNotas.text.trim(),
          );
      messenger.showSnackBar(
        const SnackBar(
          content: Text('Cierre enviado con éxito'),
          backgroundColor: Colors.green,
        ),
      );
      ref.invalidate(resumenCierreHoyProveedor);
      if (mounted) {
        setState(() {
          _foto = null;
          _ctrlMonto.clear();
          _ctrlNotas.clear();
          _bloqueadoPorCierreExistente = true;
        });
      }
    } on ExcepcionApi catch (e) {
      if (e.codigoNegocio == 'CIERRE_YA_EXISTE' || e.codigoHttp == 409) {
        setState(() => _bloqueadoPorCierreExistente = true);
        messenger.showSnackBar(
          SnackBar(
            content: const Text('Ya enviaste el cierre de hoy'),
            backgroundColor: Colors.orange.shade700,
          ),
        );
      } else {
        messenger.showSnackBar(
          SnackBar(content: Text(e.mensaje), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final asincrono = ref.watch(resumenCierreHoyProveedor);

    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(resumenCierreHoyProveedor),
      child: asincrono.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ListView(
          children: [const SizedBox(height: 200), Center(child: Text('Error: $e'))],
        ),
        data: (resumen) => ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Esperado para ${resumen.fecha}',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 8),
                    Text(
                      '\$${resumen.montoEsperado}',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    Text('${resumen.cantidadPedidos} pedidos contra-entrega'),
                    if (resumen.pedidos.isNotEmpty) ...[
                      const Divider(height: 24),
                      ...resumen.pedidos.map(
                        (p) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(child: Text(p.codigoSeguimiento)),
                              Text('\$${p.montoContraEntrega}'),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Reportar cierre',
                        style: Theme.of(context).textTheme.titleMedium),
                    if (_bloqueadoPorCierreExistente) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.orange),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.info_outline, color: Colors.orange),
                            SizedBox(width: 8),
                            Expanded(child: Text('Ya enviaste el cierre de hoy.')),
                          ],
                        ),
                      ),
                    ] else ...[
                      const SizedBox(height: 12),
                      TextField(
                        controller: _ctrlMonto,
                        keyboardType:
                            const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(
                          labelText: 'Monto reportado',
                          prefixText: '\$ ',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _ctrlNotas,
                        decoration: const InputDecoration(labelText: 'Notas (opcional)'),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 12),
                      _seccionFotoComprobante(),
                      const SizedBox(height: 16),
                      FilledButton.icon(
                        onPressed: (_foto != null &&
                                _ctrlMonto.text.trim().isNotEmpty &&
                                !_enviando)
                            ? _enviar
                            : null,
                        icon: _enviando
                            ? const SizedBox(
                                height: 18,
                                width: 18,
                                child: CircularProgressIndicator(strokeWidth: 2),
                              )
                            : const Icon(Icons.send),
                        label: const Text('Enviar cierre'),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _seccionFotoComprobante() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Comprobante (foto)'),
        const SizedBox(height: 8),
        if (_foto != null)
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.file(_foto!, height: 160, fit: BoxFit.cover),
          )
        else
          Container(
            height: 160,
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Center(
              child: Icon(Icons.photo, size: 48, color: Colors.grey),
            ),
          ),
        const SizedBox(height: 8),
        FilledButton.tonalIcon(
          onPressed: _capturarFoto,
          icon: const Icon(Icons.camera_alt),
          label: Text(_foto == null ? 'Capturar foto' : 'Reemplazar foto'),
        ),
      ],
    );
  }
}
