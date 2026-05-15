import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../nucleo/tema/tokens_rapix.dart';
import '../../widgets/wordmark_rapix.dart';
import 'autenticacion_controlador.dart';

class RecuperarContrasenaPantalla extends ConsumerStatefulWidget {
  const RecuperarContrasenaPantalla({super.key});

  @override
  ConsumerState<RecuperarContrasenaPantalla> createState() =>
      _RecuperarContrasenaPantallaEstado();
}

class _RecuperarContrasenaPantallaEstado
    extends ConsumerState<RecuperarContrasenaPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    final email = _emailCtrl.text.trim();
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .solicitarRecuperacionContrasena(email: email);
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Si el correo está registrado, recibirás un código en breve.',
          ),
        ),
      );
      context.push('/recuperar-contrasena/confirmar', extra: email);
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
      backgroundColor: tokens(context).fondo,
      appBar: AppBar(
        backgroundColor: tokens(context).fondo,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: tokens(context).tinta),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Form(
                key: _formulario,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const _Encabezado(),
                    const SizedBox(height: 32),
                    const _Titulo(),
                    const SizedBox(height: 24),
                    _CampoEtiquetado(
                      etiqueta: 'Correo electrónico',
                      hint: 'tu@correo.com',
                      controlador: _emailCtrl,
                      tipoTeclado: TextInputType.emailAddress,
                      autofill: const [AutofillHints.email],
                      validador: (v) {
                        final t = v?.trim() ?? '';
                        if (t.isEmpty) return 'Ingresa tu correo';
                        if (!t.contains('@')) return 'Correo inválido';
                        return null;
                      },
                    ),
                    const SizedBox(height: 22),
                    _BotonPrincipal(
                      etiqueta: 'Enviar código',
                      cargando: estado.cargando,
                      alPresionar: estado.cargando ? null : _enviar,
                    ),
                    const SizedBox(height: 18),
                    Center(
                      child: TextButton(
                        onPressed: () => context.pop(),
                        child: const Text('Volver al inicio de sesión'),
                      ),
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

class _Encabezado extends StatelessWidget {
  const _Encabezado();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        WordmarkRapix(tamano: 28),
      ],
    );
  }
}

class _Titulo extends StatelessWidget {
  const _Titulo();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recuperar contraseña',
          style: GoogleFonts.inter(
            fontSize: 26,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.6,
            color: tokens(context).tinta,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Te enviaremos un código de 6 dígitos a tu correo para que puedas '
          'restablecer tu contraseña.',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: tokens(context).tintaSilenciada,
            height: 1.5,
          ),
        ),
      ],
    );
  }
}

class _CampoEtiquetado extends StatelessWidget {
  const _CampoEtiquetado({
    required this.etiqueta,
    required this.controlador,
    this.hint,
    this.tipoTeclado,
    this.validador,
    this.autofill,
  });

  final String etiqueta;
  final String? hint;
  final TextEditingController controlador;
  final TextInputType? tipoTeclado;
  final String? Function(String?)? validador;
  final Iterable<String>? autofill;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 2, bottom: 6),
          child: Text(
            etiqueta,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: tokens(context).tintaSilenciada,
            ),
          ),
        ),
        TextFormField(
          controller: controlador,
          keyboardType: tipoTeclado,
          autofillHints: autofill,
          validator: validador,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: tokens(context).tinta,
          ),
          decoration: InputDecoration(hintText: hint),
        ),
      ],
    );
  }
}

class _BotonPrincipal extends StatelessWidget {
  const _BotonPrincipal({
    required this.etiqueta,
    required this.cargando,
    required this.alPresionar,
  });

  final String etiqueta;
  final bool cargando;
  final VoidCallback? alPresionar;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        boxShadow: alPresionar == null
            ? null
            : [
                BoxShadow(
                  color: TokensRapix.verde.withValues(alpha: 0.3),
                  offset: const Offset(0, 6),
                  blurRadius: 16,
                ),
              ],
      ),
      child: FilledButton(
        onPressed: alPresionar,
        child: cargando
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            : Text(etiqueta),
      ),
    );
  }
}
