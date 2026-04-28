import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/excepciones_api.dart';
import 'controlador_autenticacion.dart';

class PantallaInicioSesion extends ConsumerStatefulWidget {
  const PantallaInicioSesion({super.key});

  @override
  ConsumerState<PantallaInicioSesion> createState() => _PantallaInicioSesionEstado();
}

class _PantallaInicioSesionEstado extends ConsumerState<PantallaInicioSesion> {
  final _claveForm = GlobalKey<FormState>();
  final _ctrlEmail = TextEditingController();
  final _ctrlContrasena = TextEditingController();
  bool _ocultarContrasena = true;

  @override
  void dispose() {
    _ctrlEmail.dispose();
    _ctrlContrasena.dispose();
    super.dispose();
  }

  Future<void> _enviar() async {
    if (!_claveForm.currentState!.validate()) return;
    try {
      await ref.read(controladorAutenticacionProveedor.notifier).iniciarSesion(
            email: _ctrlEmail.text.trim(),
            contrasena: _ctrlContrasena.text,
          );
    } on ExcepcionApi catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.mensaje), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(controladorAutenticacionProveedor);
    final cargando = estado.isLoading;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Form(
                key: _claveForm,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 32),
                    Icon(
                      Icons.delivery_dining,
                      size: 72,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Rapix Repartidor',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 32),
                    TextFormField(
                      controller: _ctrlEmail,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(labelText: 'Email'),
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) return 'Email requerido';
                        if (!v.contains('@')) return 'Email inválido';
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _ctrlContrasena,
                      obscureText: _ocultarContrasena,
                      decoration: InputDecoration(
                        labelText: 'Contraseña',
                        suffixIcon: IconButton(
                          icon: Icon(
                            _ocultarContrasena ? Icons.visibility : Icons.visibility_off,
                          ),
                          onPressed: () => setState(() {
                            _ocultarContrasena = !_ocultarContrasena;
                          }),
                        ),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Contraseña requerida';
                        if (v.length < 6) return 'Mínimo 6 caracteres';
                        return null;
                      },
                    ),
                    const SizedBox(height: 24),
                    FilledButton(
                      onPressed: cargando ? null : _enviar,
                      child: cargando
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Iniciar sesión'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
