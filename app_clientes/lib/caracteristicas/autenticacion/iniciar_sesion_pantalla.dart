import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'autenticacion_controlador.dart';

class IniciarSesionPantalla extends ConsumerStatefulWidget {
  const IniciarSesionPantalla({super.key});

  @override
  ConsumerState<IniciarSesionPantalla> createState() =>
      _IniciarSesionPantallaEstado();
}

class _IniciarSesionPantallaEstado
    extends ConsumerState<IniciarSesionPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _contrasenaCtrl = TextEditingController();
  bool _verContrasena = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _contrasenaCtrl.dispose();
    super.dispose();
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .iniciarSesion(
          email: _emailCtrl.text.trim(),
          contrasena: _contrasenaCtrl.text,
        );
    if (!mounted) return;
    if (ok) {
      context.go('/inicio');
    } else {
      final error = ref.read(autenticacionControladorProvider).error;
      if (error != null) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(autenticacionControladorProvider);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Form(
                key: _formulario,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Icon(
                      Icons.local_shipping_outlined,
                      size: 64,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Bienvenido',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Inicia sesion para gestionar tus pedidos',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),
                    TextFormField(
                      controller: _emailCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Correo electronico',
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      autofillHints: const [AutofillHints.email],
                      validator: (v) {
                        final t = v?.trim() ?? '';
                        if (t.isEmpty) return 'Ingresa tu correo';
                        if (!t.contains('@')) return 'Correo invalido';
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _contrasenaCtrl,
                      decoration: InputDecoration(
                        labelText: 'Contrasena',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          icon: Icon(_verContrasena
                              ? Icons.visibility_off
                              : Icons.visibility),
                          onPressed: () =>
                              setState(() => _verContrasena = !_verContrasena),
                        ),
                      ),
                      obscureText: !_verContrasena,
                      validator: (v) =>
                          (v == null || v.isEmpty) ? 'Ingresa tu contrasena' : null,
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
                          : const Text('Iniciar sesion'),
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () => context.push('/registrar'),
                      child: const Text('Crear cuenta de vendedor'),
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
