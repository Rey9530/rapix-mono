import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../nucleo/tema/tokens_rapix.dart';
import '../../widgets/wordmark_rapix.dart';
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

  void _mostrarProximamente(String funcionalidad) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$funcionalidad — próximamente'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(autenticacionControladorProvider);
    return Scaffold(
      backgroundColor: TokensRapix.fondo,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Form(
                key: _formulario,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const _Encabezado(),
                    const SizedBox(height: 36),
                    const _Bienvenida(),
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
                    const SizedBox(height: 14),
                    _CampoEtiquetado(
                      etiqueta: 'Contraseña',
                      hint: '••••••••',
                      controlador: _contrasenaCtrl,
                      ofuscar: !_verContrasena,
                      autofill: const [AutofillHints.password],
                      sufijo: _BotonSufijoTexto(
                        texto: _verContrasena ? 'OCULTAR' : 'MOSTRAR',
                        alPresionar: () => setState(
                          () => _verContrasena = !_verContrasena,
                        ),
                      ),
                      validador: (v) => (v == null || v.isEmpty)
                          ? 'Ingresa tu contraseña'
                          : null,
                    ),
                    const SizedBox(height: 4),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => _mostrarProximamente(
                          'Recuperación de contraseña',
                        ),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: const Text('¿Olvidaste tu contraseña?'),
                      ),
                    ),
                    const SizedBox(height: 18),
                    _BotonPrincipal(
                      etiqueta: 'Iniciar sesión',
                      cargando: estado.cargando,
                      alPresionar: estado.cargando ? null : _enviar,
                    ),
                    const SizedBox(height: 22),
                    const _DivisorOContinua(),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _BotonOAuth(
                            etiqueta: 'Google',
                            alPresionar: () =>
                                _mostrarProximamente('Login con Google'),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _BotonOAuth(
                            etiqueta: 'Apple',
                            alPresionar: () =>
                                _mostrarProximamente('Login con Apple'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    _PieRegistro(
                      alPresionar: () => context.push('/registrar'),
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
      children: [
        const WordmarkRapix(tamano: 32),
        const SizedBox(height: 8),
        Text(
          'Logística simple para tu negocio',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: TokensRapix.tintaSilenciada,
            height: 1.5,
          ),
        ),
      ],
    );
  }
}

class _Bienvenida extends StatelessWidget {
  const _Bienvenida();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Bienvenido de vuelta',
          style: GoogleFonts.inter(
            fontSize: 26,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.6,
            color: TokensRapix.tinta,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Inicia sesión para gestionar tus envíos.',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: TokensRapix.tintaSilenciada,
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
    this.ofuscar = false,
    this.sufijo,
    this.validador,
    this.autofill,
  });

  final String etiqueta;
  final String? hint;
  final TextEditingController controlador;
  final TextInputType? tipoTeclado;
  final bool ofuscar;
  final Widget? sufijo;
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
              color: TokensRapix.tintaSilenciada,
            ),
          ),
        ),
        TextFormField(
          controller: controlador,
          keyboardType: tipoTeclado,
          obscureText: ofuscar,
          autofillHints: autofill,
          validator: validador,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: TokensRapix.tinta,
            letterSpacing: ofuscar ? 3 : null,
          ),
          decoration: InputDecoration(
            hintText: hint,
            suffixIcon: sufijo,
            suffixIconConstraints: const BoxConstraints(
              minWidth: 0,
              minHeight: 0,
            ),
          ),
        ),
      ],
    );
  }
}

class _BotonSufijoTexto extends StatelessWidget {
  const _BotonSufijoTexto({
    required this.texto,
    required this.alPresionar,
  });

  final String texto;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: alPresionar,
        child: Text(
          texto,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: TokensRapix.verde,
            letterSpacing: 0.4,
          ),
        ),
      ),
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

class _DivisorOContinua extends StatelessWidget {
  const _DivisorOContinua();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider()),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Text(
            'O CONTINÚA CON',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: TokensRapix.tintaSuave,
              letterSpacing: 0.5,
            ),
          ),
        ),
        const Expanded(child: Divider()),
      ],
    );
  }
}

class _BotonOAuth extends StatelessWidget {
  const _BotonOAuth({
    required this.etiqueta,
    required this.alPresionar,
  });

  final String etiqueta;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: alPresionar,
      child: Text(etiqueta),
    );
  }
}

class _PieRegistro extends StatelessWidget {
  const _PieRegistro({required this.alPresionar});

  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '¿Aún no tienes cuenta? ',
            style: GoogleFonts.inter(
              fontSize: 13,
              color: TokensRapix.tintaSilenciada,
            ),
          ),
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: alPresionar,
            child: Text(
              'Regístrate',
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: TokensRapix.verde,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
