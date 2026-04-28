import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:signature/signature.dart';

import '../../core/network/excepciones_api.dart';
import '../../core/proveedores_globales.dart';
import '../recogidas/proveedor_recogidas.dart';
import 'proveedor_entregas.dart';

class PantallaComprobanteEntrega extends ConsumerStatefulWidget {
  final String pedidoId;
  const PantallaComprobanteEntrega({super.key, required this.pedidoId});

  @override
  ConsumerState<PantallaComprobanteEntrega> createState() =>
      _PantallaComprobanteEntregaEstado();
}

class _PantallaComprobanteEntregaEstado
    extends ConsumerState<PantallaComprobanteEntrega> {
  final _ctrlRecibido = TextEditingController();
  final _ctrlNotas = TextEditingController();
  final _ctrlFirma = SignatureController(
    penStrokeWidth: 3,
    penColor: Colors.black,
    exportBackgroundColor: Colors.white,
  );

  File? _foto;
  bool _enviando = false;

  @override
  void dispose() {
    _ctrlRecibido.dispose();
    _ctrlNotas.dispose();
    _ctrlFirma.dispose();
    super.dispose();
  }

  Future<void> _capturarFoto() async {
    final picker = ImagePicker();
    final imagen = await picker.pickImage(
      source: ImageSource.camera,
      maxWidth: 1600,
      imageQuality: 80,
    );
    if (imagen != null) {
      setState(() => _foto = File(imagen.path));
    }
  }

  Future<void> _enviar() async {
    if (_foto == null) return;
    setState(() => _enviando = true);

    final messenger = ScaffoldMessenger.of(context);
    final repo = ref.read(pedidosRepositorioProveedor);

    File? archivoFirma;
    if (_ctrlFirma.isNotEmpty) {
      final Uint8List? bytes = await _ctrlFirma.toPngBytes();
      if (bytes != null) {
        final dir = await getTemporaryDirectory();
        final ruta = '${dir.path}/firma_${widget.pedidoId}.png';
        archivoFirma = await File(ruta).writeAsBytes(bytes);
      }
    }

    Position? pos;
    try {
      pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );
    } catch (_) {/* sin geo */}

    try {
      await repo.entregar(
        id: widget.pedidoId,
        foto: _foto!,
        firma: archivoFirma,
        recibidoPor: _ctrlRecibido.text.trim().isEmpty
            ? null
            : _ctrlRecibido.text.trim(),
        notas: _ctrlNotas.text.trim().isEmpty ? null : _ctrlNotas.text.trim(),
        lat: pos?.latitude,
        lng: pos?.longitude,
      );
      ref.invalidate(entregasPendientesProveedor);
      ref.invalidate(pedidoPorIdProveedor(widget.pedidoId));
      messenger.showSnackBar(
        const SnackBar(content: Text('¡Entrega confirmada!'), backgroundColor: Colors.green),
      );
      if (mounted) context.go('/inicio/entregas');
    } on ExcepcionApi catch (e) {
      messenger.showSnackBar(SnackBar(content: Text(e.mensaje), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Comprobante de entrega'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/inicio/entregas/${widget.pedidoId}'),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _seccionFoto(),
          const SizedBox(height: 16),
          _seccionFirma(),
          const SizedBox(height: 16),
          TextField(
            controller: _ctrlRecibido,
            decoration: const InputDecoration(
              labelText: 'Recibido por',
              hintText: 'Nombre de quien recibe',
            ),
            maxLength: 120,
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _ctrlNotas,
            decoration: const InputDecoration(labelText: 'Notas (opcional)'),
            maxLines: 3,
            maxLength: 240,
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: (_foto != null && !_enviando) ? _enviar : null,
            icon: _enviando
                ? const SizedBox(
                    height: 18,
                    width: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.check_circle),
            label: const Text('Confirmar entrega'),
          ),
        ],
      ),
    );
  }

  Widget _seccionFoto() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Foto del paquete entregado',
                style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Requerida'),
            const SizedBox(height: 12),
            if (_foto != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.file(_foto!, height: 200, fit: BoxFit.cover),
              )
            else
              Container(
                height: 200,
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Center(child: Icon(Icons.photo, size: 48, color: Colors.grey)),
              ),
            const SizedBox(height: 12),
            FilledButton.tonalIcon(
              onPressed: _capturarFoto,
              icon: const Icon(Icons.camera_alt),
              label: Text(_foto == null ? 'Capturar foto' : 'Reemplazar foto'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _seccionFirma() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Firma del receptor',
                style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Opcional'),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Signature(
                controller: _ctrlFirma,
                height: 180,
                backgroundColor: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            TextButton.icon(
              onPressed: () => _ctrlFirma.clear(),
              icon: const Icon(Icons.refresh),
              label: const Text('Limpiar firma'),
            ),
          ],
        ),
      ),
    );
  }
}
