import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../datos/repositorios/usuarios_repositorio.dart';
import '../autenticacion/autenticacion_controlador.dart';

class EditarNegocioPantalla extends ConsumerStatefulWidget {
  const EditarNegocioPantalla({super.key});

  @override
  ConsumerState<EditarNegocioPantalla> createState() =>
      _EditarNegocioPantallaState();
}

class _EditarNegocioPantallaState extends ConsumerState<EditarNegocioPantalla> {
  final _formKey = GlobalKey<FormState>();
  final _nombreNegocio = TextEditingController();
  final _rfc = TextEditingController();
  final _direccion = TextEditingController();

  double? _latitud;
  double? _longitud;
  XFile? _logoNuevo;
  bool _enviando = false;
  final _selectorImagen = ImagePicker();

  @override
  void initState() {
    super.initState();
    final perfil = ref.read(autenticacionControladorProvider).usuario?.perfilVendedor;
    _nombreNegocio.text = perfil?.nombreNegocio ?? '';
    _rfc.text = perfil?.rfc ?? '';
    _direccion.text = perfil?.direccion ?? '';
    _latitud = perfil?.latitud;
    _longitud = perfil?.longitud;
  }

  @override
  void dispose() {
    _nombreNegocio.dispose();
    _rfc.dispose();
    _direccion.dispose();
    super.dispose();
  }

  Future<void> _elegirLogo() async {
    final origen = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_camera_outlined),
              title: const Text('Tomar foto'),
              onTap: () => Navigator.pop(ctx, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Elegir de galería'),
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
        maxWidth: 1024,
        imageQuality: 85,
      );
      if (imagen != null) {
        setState(() => _logoNuevo = imagen);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo abrir el selector: $e')),
      );
    }
  }

  Future<void> _elegirUbicacion() async {
    final inicial = (_latitud != null && _longitud != null)
        ? mb.Point(coordinates: mb.Position(_longitud!, _latitud!))
        : null;
    final resultado = await context.push<mb.Point>(
      '/seleccionar-ubicacion',
      extra: {
        'titulo': 'Ubicación del negocio',
        'inicial': inicial,
      },
    );
    if (resultado != null) {
      setState(() {
        _latitud = resultado.coordinates.lat.toDouble();
        _longitud = resultado.coordinates.lng.toDouble();
      });
    }
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;
    if (_latitud == null || _longitud == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecciona la ubicación del negocio en el mapa.'),
        ),
      );
      return;
    }

    setState(() => _enviando = true);
    try {
      final repo = ref.read(usuariosRepositorioProvider);
      final usuario = await repo.actualizarPerfilVendedor(
        ActualizarPerfilVendedorEntrada(
          nombreNegocio: _nombreNegocio.text.trim(),
          rfc: _rfc.text.trim().isEmpty ? null : _rfc.text.trim(),
          direccion: _direccion.text.trim(),
          latitud: _latitud,
          longitud: _longitud,
          logo: _logoNuevo,
        ),
      );
      await ref
          .read(autenticacionControladorProvider.notifier)
          .actualizarUsuario(usuario);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Negocio actualizado.')),
      );
      context.pop();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_mensajeError(e))),
      );
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  String _mensajeError(Object error) {
    if (error is DioException) {
      final data = error.response?.data;
      if (data is Map && data['message'] is String) return data['message'] as String;
      if (data is Map && data['mensaje'] is String) return data['mensaje'] as String;
    }
    return 'No se pudo guardar el negocio. Intenta de nuevo.';
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final usuario = ref.watch(autenticacionControladorProvider).usuario;
    final urlLogoExistente = usuario?.perfilVendedor?.urlLogo;
    final inicial = (usuario?.nombreCompleto.trim().isNotEmpty ?? false)
        ? usuario!.nombreCompleto.trim()[0].toUpperCase()
        : '?';

    return Scaffold(
      appBar: AppBar(title: const Text('Editar negocio')),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Center(
                child: Column(
                  children: [
                    _LogoPreview(
                      logoNuevo: _logoNuevo,
                      urlExistente: urlLogoExistente,
                      placeholder: inicial,
                      colorScheme: colorScheme,
                    ),
                    const SizedBox(height: 8),
                    TextButton.icon(
                      onPressed: _enviando ? null : _elegirLogo,
                      icon: const Icon(Icons.image_outlined),
                      label: Text(
                        urlLogoExistente == null && _logoNuevo == null
                            ? 'Agregar logo'
                            : 'Cambiar logo',
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _nombreNegocio,
                decoration: const InputDecoration(
                  labelText: 'Nombre del negocio',
                  prefixIcon: Icon(Icons.storefront_outlined),
                ),
                validator: (v) {
                  final t = (v ?? '').trim();
                  if (t.length < 2) return 'Ingresa al menos 2 caracteres';
                  if (t.length > 120) return 'Máximo 120 caracteres';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _rfc,
                decoration: const InputDecoration(
                  labelText: 'RFC (opcional)',
                  prefixIcon: Icon(Icons.badge_outlined),
                ),
                validator: (v) {
                  final t = (v ?? '').trim();
                  if (t.isNotEmpty && t.length > 20) return 'Máximo 20 caracteres';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _direccion,
                decoration: const InputDecoration(
                  labelText: 'Dirección',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
                maxLines: 2,
                validator: (v) {
                  final t = (v ?? '').trim();
                  if (t.length < 3) return 'Ingresa una dirección';
                  if (t.length > 240) return 'Máximo 240 caracteres';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.map_outlined),
                  title: const Text('Ubicación en mapa'),
                  subtitle: Text(
                    (_latitud != null && _longitud != null)
                        ? '${_latitud!.toStringAsFixed(5)}, ${_longitud!.toStringAsFixed(5)}'
                        : 'Sin coordenadas',
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: _enviando ? null : _elegirUbicacion,
                ),
              ),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: _enviando ? null : _guardar,
                icon: _enviando
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.save_outlined),
                label: Text(_enviando ? 'Guardando…' : 'Guardar cambios'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _LogoPreview extends StatelessWidget {
  const _LogoPreview({
    required this.logoNuevo,
    required this.urlExistente,
    required this.placeholder,
    required this.colorScheme,
  });

  final XFile? logoNuevo;
  final String? urlExistente;
  final String placeholder;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    const size = 96.0;
    final radius = size / 2;

    if (logoNuevo != null) {
      return CircleAvatar(
        radius: radius,
        backgroundImage: FileImage(File(logoNuevo!.path)),
      );
    }
    if (urlExistente != null && urlExistente!.isNotEmpty) {
      return CircleAvatar(
        radius: radius,
        backgroundImage: NetworkImage(urlExistente!),
        onBackgroundImageError: (_, _) {},
      );
    }
    return CircleAvatar(
      radius: radius,
      backgroundColor: colorScheme.primaryContainer,
      child: Text(
        placeholder,
        style: TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.bold,
          color: colorScheme.onPrimaryContainer,
        ),
      ),
    );
  }
}
