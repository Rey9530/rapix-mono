import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import 'autenticacion_controlador.dart';

class RegistrarPantalla extends ConsumerStatefulWidget {
  const RegistrarPantalla({super.key});

  @override
  ConsumerState<RegistrarPantalla> createState() => _RegistrarPantallaEstado();
}

class _RegistrarPantallaEstado extends ConsumerState<RegistrarPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _telefonoCtrl = TextEditingController();
  final _contrasenaCtrl = TextEditingController();
  final _nombreCtrl = TextEditingController();
  final _negocioCtrl = TextEditingController();
  final _direccionCtrl = TextEditingController();

  mb.Point? _ubicacionTienda;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _telefonoCtrl.dispose();
    _contrasenaCtrl.dispose();
    _nombreCtrl.dispose();
    _negocioCtrl.dispose();
    _direccionCtrl.dispose();
    super.dispose();
  }

  Future<void> _elegirUbicacion() async {
    final resultado = await context.push<mb.Point>(
      '/seleccionar-ubicacion',
      extra: {
        'titulo': 'Ubicacion de la tienda --',
        'inicial': _ubicacionTienda,
      },
    );
    if (resultado != null) {
      setState(() => _ubicacionTienda = resultado);
    }
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    if (_ubicacionTienda == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona la ubicacion de la tienda')),
      );
      return;
    }
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .registrar(
          email: _emailCtrl.text.trim(),
          telefono: _telefonoCtrl.text.trim(),
          contrasena: _contrasenaCtrl.text,
          nombreCompleto: _nombreCtrl.text.trim(),
          nombreNegocio: _negocioCtrl.text.trim(),
          direccion: _direccionCtrl.text.trim(),
          latitud: _ubicacionTienda!.coordinates.lat.toDouble(),
          longitud: _ubicacionTienda!.coordinates.lng.toDouble(),
        );
    if (!mounted) return;
    if (ok) {
      context.go('/inicio');
    } else {
      final error = ref.read(autenticacionControladorProvider).error;
      if (error != null) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(error)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(autenticacionControladorProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Crear cuenta de vendedor')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formulario,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _nombreCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Nombre completo',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  textCapitalization: TextCapitalization.words,
                  validator: (v) =>
                      (v == null || v.trim().length < 2) ? 'Requerido' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _emailCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Correo electronico',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) {
                    final t = v?.trim() ?? '';
                    if (!t.contains('@')) return 'Correo invalido';
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _telefonoCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Telefono',
                    prefixIcon: Icon(Icons.phone_outlined),
                    hintText: '+50370001234',
                  ),
                  keyboardType: TextInputType.phone,
                  validator: (v) {
                    final t = v?.trim() ?? '';
                    if (!RegExp(r'^\+?[0-9]{8,15}$').hasMatch(t)) {
                      return '8-15 digitos, opcional con +';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _contrasenaCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Contrasena',
                    prefixIcon: Icon(Icons.lock_outline),
                    helperText: '8+ chars, mayuscula, numero y simbolo',
                  ),
                  obscureText: true,
                  validator: (v) {
                    if (v == null || v.length < 8) return 'Minimo 8 caracteres';
                    if (!RegExp(r'[A-Z]').hasMatch(v)) {
                      return 'Debe incluir una mayuscula';
                    }
                    if (!RegExp(r'[0-9]').hasMatch(v)) {
                      return 'Debe incluir un numero';
                    }
                    if (!RegExp(r'[^A-Za-z0-9]').hasMatch(v)) {
                      return 'Debe incluir un simbolo';
                    }
                    return null;
                  },
                ),
                const Divider(height: 32),
                Text(
                  'Datos de la tienda',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _negocioCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Nombre del negocio',
                    prefixIcon: Icon(Icons.storefront_outlined),
                  ),
                  textCapitalization: TextCapitalization.words,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Requerido' : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _direccionCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Direccion',
                    prefixIcon: Icon(Icons.place_outlined),
                  ),
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Requerido' : null,
                ),
                const SizedBox(height: 12),
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.map_outlined),
                    title: Text(
                      _ubicacionTienda == null
                          ? 'Seleccionar ubicacion en mapa'
                          : 'Ubicacion seleccionada',
                    ),
                    subtitle: _ubicacionTienda != null
                        ? Text(
                            '(${_ubicacionTienda!.coordinates.lat.toStringAsFixed(5)}, '
                            '${_ubicacionTienda!.coordinates.lng.toStringAsFixed(5)})',
                          )
                        : null,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: _elegirUbicacion,
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: estado.cargando ? null : _enviar,
                  child: estado.cargando
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Crear cuenta'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
