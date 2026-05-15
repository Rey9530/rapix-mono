import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../nucleo/tema/tokens_rapix.dart';
import '../../widgets/wordmark_rapix.dart';
import 'autenticacion_controlador.dart';

class ConfirmarRecuperacionPantalla extends ConsumerStatefulWidget {
  const ConfirmarRecuperacionPantalla({super.key, required this.email});

  final String email;

  @override
  ConsumerState<ConfirmarRecuperacionPantalla> createState() =>
      _ConfirmarRecuperacionPantallaEstado();
}

class _ConfirmarRecuperacionPantallaEstado
    extends ConsumerState<ConfirmarRecuperacionPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _codigoCtrl = TextEditingController();
  final _contrasenaCtrl = TextEditingController();
  final _confirmarCtrl = TextEditingController();
  bool _verContrasena = false;
  bool _verConfirmar = false;

  @override
  void dispose() {
    _codigoCtrl.dispose();
    _contrasenaCtrl.dispose();
    _confirmarCtrl.dispose();
    super.dispose();
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .confirmarRecuperacionContrasena(
          email: widget.email,
          codigo: _codigoCtrl.text.trim(),
          nuevaContrasena: _contrasenaCtrl.text,
        );
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Contraseña actualizada. Inicia sesión.'),
        ),
      );
      context.go('/iniciar-sesion');
    } else {
      final error = ref.read(autenticacionControladorProvider).error;
      if (error != null) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error)));
      }
    }
  }

  Future<void> _reenviar() async {
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .solicitarRecuperacionContrasena(email: widget.email);
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Te enviamos un nuevo código.')),
      );
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
                    _Titulo(email: widget.email),
                    const SizedBox(height: 24),
                    _CampoEtiquetado(
                      etiqueta: 'Código de 6 dígitos',
                      hint: '••••••',
                      controlador: _codigoCtrl,
                      tipoTeclado: TextInputType.number,
                      maxLength: 6,
                      formatters: [
                        FilteringTextInputFormatter.digitsOnly,
                      ],
                      validador: (v) {
                        final t = v?.trim() ?? '';
                        if (t.isEmpty) return 'Ingresa el código';
                        if (!RegExp(r'^[0-9]{6}$').hasMatch(t)) {
                          return 'El código debe tener 6 dígitos';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 14),
                    _CampoEtiquetado(
                      etiqueta: 'Nueva contraseña',
                      hint: '••••••••',
                      controlador: _contrasenaCtrl,
                      ofuscar: !_verContrasena,
                      autofill: const [AutofillHints.newPassword],
                      sufijo: _BotonSufijoTexto(
                        texto: _verContrasena ? 'OCULTAR' : 'MOSTRAR',
                        alPresionar: () => setState(
                          () => _verContrasena = !_verContrasena,
                        ),
                      ),
                      validador: (v) {
                        final t = v ?? '';
                        if (t.isEmpty) return 'Ingresa una nueva contraseña';
                        if (t.length < 8) {
                          return 'Mínimo 8 caracteres';
                        }
                        if (!RegExp(r'[A-Z]').hasMatch(t)) {
                          return 'Debe incluir una mayúscula';
                        }
                        if (!RegExp(r'[0-9]').hasMatch(t)) {
                          return 'Debe incluir un número';
                        }
                        if (!RegExp(r'[!@#\$%^&*(),.?":{}|<>_\-+=/\\\[\]~`'
                                "'"
                                r';]')
                            .hasMatch(t)) {
                          return 'Debe incluir un símbolo';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 6),
                    Padding(
                      padding: const EdgeInsets.only(left: 2),
                      child: Text(
                        'Mínimo 8 caracteres con mayúscula, número y símbolo.',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: tokens(context).tintaSuave,
                          height: 1.4,
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _CampoEtiquetado(
                      etiqueta: 'Confirmar contraseña',
                      hint: '••••••••',
                      controlador: _confirmarCtrl,
                      ofuscar: !_verConfirmar,
                      sufijo: _BotonSufijoTexto(
                        texto: _verConfirmar ? 'OCULTAR' : 'MOSTRAR',
                        alPresionar: () => setState(
                          () => _verConfirmar = !_verConfirmar,
                        ),
                      ),
                      validador: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Confirma tu contraseña';
                        }
                        if (v != _contrasenaCtrl.text) {
                          return 'Las contraseñas no coinciden';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 22),
                    _BotonPrincipal(
                      etiqueta: 'Cambiar contraseña',
                      cargando: estado.cargando,
                      alPresionar: estado.cargando ? null : _enviar,
                    ),
                    const SizedBox(height: 12),
                    Center(
                      child: TextButton(
                        onPressed: estado.cargando ? null : _reenviar,
                        child: const Text('¿No te llegó? Reenviar código'),
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
  const _Titulo({required this.email});

  final String email;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Verifica el código',
          style: GoogleFonts.inter(
            fontSize: 26,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.6,
            color: tokens(context).tinta,
            height: 1.2,
          ),
        ),
        const SizedBox(height: 8),
        RichText(
          text: TextSpan(
            style: GoogleFonts.inter(
              fontSize: 13,
              color: tokens(context).tintaSilenciada,
              height: 1.5,
            ),
            children: [
              const TextSpan(text: 'Enviamos un código a '),
              TextSpan(
                text: email,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: tokens(context).tinta,
                ),
              ),
              const TextSpan(text: '. Ingrésalo abajo junto a tu nueva contraseña.'),
            ],
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
    this.maxLength,
    this.formatters,
  });

  final String etiqueta;
  final String? hint;
  final TextEditingController controlador;
  final TextInputType? tipoTeclado;
  final bool ofuscar;
  final Widget? sufijo;
  final String? Function(String?)? validador;
  final Iterable<String>? autofill;
  final int? maxLength;
  final List<TextInputFormatter>? formatters;

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
          obscureText: ofuscar,
          autofillHints: autofill,
          validator: validador,
          maxLength: maxLength,
          inputFormatters: formatters,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: tokens(context).tinta,
            letterSpacing: ofuscar ? 3 : null,
          ),
          decoration: InputDecoration(
            hintText: hint,
            counterText: '',
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
