import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../datos/modelos/cuenta_bancaria.dart';
import '../../../datos/repositorios/cuentas_bancarias_repositorio.dart';
import '../../../nucleo/tema/tokens_rapix.dart';
import 'cuentas_bancarias_controlador.dart';
import 'errores_cuentas_bancarias.dart';

class FormularioCuentaBancariaPantalla extends ConsumerStatefulWidget {
  const FormularioCuentaBancariaPantalla({super.key, this.cuentaId});

  final String? cuentaId;

  bool get esEdicion => cuentaId != null;

  @override
  ConsumerState<FormularioCuentaBancariaPantalla> createState() =>
      _FormularioCuentaBancariaPantallaState();
}

class _FormularioCuentaBancariaPantallaState
    extends ConsumerState<FormularioCuentaBancariaPantalla> {
  final _formKey = GlobalKey<FormState>();
  final _numeroCuenta = TextEditingController();
  final _alias = TextEditingController();

  String? _bancoId;
  TipoCuentaBancaria _tipoCuenta = TipoCuentaBancaria.ahorro;
  bool _esPrincipal = false;
  bool _inicializado = false;
  bool _enviando = false;

  @override
  void dispose() {
    _numeroCuenta.dispose();
    _alias.dispose();
    super.dispose();
  }

  void _inicializarDesde(CuentaBancaria cuenta) {
    if (_inicializado) return;
    _inicializado = true;
    _bancoId = cuenta.banco.id;
    _tipoCuenta = cuenta.tipoCuenta;
    _alias.text = cuenta.alias ?? '';
    _numeroCuenta.text = cuenta.numeroCuenta;
    _esPrincipal = cuenta.esPrincipal;
  }

  @override
  Widget build(BuildContext context) {
    final t = tokens(context);
    final bancosAsync = ref.watch(bancosProvider);

    if (widget.esEdicion) {
      final cuentaAsync =
          ref.watch(cuentaBancariaPorIdProvider(widget.cuentaId!));
      cuentaAsync.whenData((c) {
        if (c != null) _inicializarDesde(c);
      });
    }

    return Scaffold(
      backgroundColor: t.fondo,
      appBar: AppBar(
        backgroundColor: t.fondo,
        elevation: 0,
        title: Text(
          widget.esEdicion ? 'Editar cuenta' : 'Nueva cuenta',
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: t.tinta,
          ),
        ),
        iconTheme: IconThemeData(color: t.tinta),
      ),
      body: bancosAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              formatearErrorCuenta(e),
              style: GoogleFonts.inter(color: t.tinta),
            ),
          ),
        ),
        data: (bancos) => _construirFormulario(bancos),
      ),
    );
  }

  Widget _construirFormulario(List<Banco> bancos) {
    final t = tokens(context);
    final bancoIdValido =
        bancos.any((b) => b.id == _bancoId) ? _bancoId : null;

    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          Text(
            'Banco',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: t.tintaSilenciada,
            ),
          ),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            initialValue: bancoIdValido,
            decoration: _decoracion(t),
            items: bancos
                .map((b) => DropdownMenuItem(
                      value: b.id,
                      child: Text(b.nombre),
                    ))
                .toList(),
            onChanged:
                widget.esEdicion ? null : (v) => setState(() => _bancoId = v),
            validator: (v) =>
                v == null || v.isEmpty ? 'Selecciona un banco' : null,
          ),
          const SizedBox(height: 16),
          Text(
            'Tipo de cuenta',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: t.tintaSilenciada,
            ),
          ),
          const SizedBox(height: 6),
          DropdownButtonFormField<TipoCuentaBancaria>(
            initialValue: _tipoCuenta,
            decoration: _decoracion(t),
            items: TipoCuentaBancaria.values
                .map((tipo) => DropdownMenuItem(
                      value: tipo,
                      child: Text(tipo.etiqueta),
                    ))
                .toList(),
            onChanged: (v) =>
                setState(() => _tipoCuenta = v ?? TipoCuentaBancaria.ahorro),
          ),
          const SizedBox(height: 16),
          Text(
            'Número de cuenta',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: t.tintaSilenciada,
            ),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: _numeroCuenta,
            keyboardType: TextInputType.number,
            enabled: !widget.esEdicion,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(20),
            ],
            decoration: _decoracion(t).copyWith(
              hintText: '8 a 20 dígitos',
            ),
            validator: (v) {
              final valor = v?.trim() ?? '';
              if (valor.isEmpty) return 'Ingresa el número de cuenta';
              if (!RegExp(r'^\d{8,20}$').hasMatch(valor)) {
                return 'Debe contener entre 8 y 20 dígitos';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          Text(
            'Alias (opcional)',
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: t.tintaSilenciada,
            ),
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: _alias,
            maxLength: 60,
            decoration: _decoracion(t).copyWith(
              hintText: 'Ej: Mi cuenta de negocio',
              counterText: '',
            ),
            validator: (v) {
              if (v == null) return null;
              if (v.length > 60) return 'Máximo 60 caracteres';
              return null;
            },
          ),
          const SizedBox(height: 8),
          SwitchListTile.adaptive(
            value: _esPrincipal,
            activeThumbColor: TokensRapix.verde,
            onChanged: (v) => setState(() => _esPrincipal = v),
            title: Text(
              'Marcar como principal',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: t.tinta,
              ),
            ),
            subtitle: Text(
              'Tus liquidaciones se enviarán a esta cuenta.',
              style: GoogleFonts.inter(
                fontSize: 11,
                color: t.tintaSilenciada,
              ),
            ),
            contentPadding: EdgeInsets.zero,
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: _enviando ? null : _guardar,
            style: FilledButton.styleFrom(
              backgroundColor: TokensRapix.verde,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: _enviando
                ? const SizedBox(
                    height: 18,
                    width: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Text(
                    'Guardar',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: _enviando ? null : () => context.pop(),
            child: Text(
              'Cancelar',
              style: GoogleFonts.inter(
                color: t.tintaSilenciada,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }

  InputDecoration _decoracion(TokensRapixExt t) {
    return InputDecoration(
      filled: true,
      fillColor: t.superficie,
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        borderSide: BorderSide(color: t.contorno),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        borderSide: BorderSide(color: t.contorno),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        borderSide: const BorderSide(color: TokensRapix.verde, width: 1.5),
      ),
      disabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
        borderSide: BorderSide(color: t.contorno),
      ),
    );
  }

  Future<void> _guardar() async {
    if (!_formKey.currentState!.validate()) return;
    if (!widget.esEdicion && (_bancoId == null || _bancoId!.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona un banco')),
      );
      return;
    }
    setState(() => _enviando = true);

    final repo = ref.read(cuentasBancariasRepositorioProvider);
    try {
      if (widget.esEdicion) {
        await repo.actualizar(
          widget.cuentaId!,
          ActualizarCuentaBancariaEntrada(
            tipoCuenta: _tipoCuenta,
            alias: _alias.text.trim(),
            esPrincipal: _esPrincipal,
          ),
        );
      } else {
        await repo.crear(
          CrearCuentaBancariaEntrada(
            bancoId: _bancoId!,
            tipoCuenta: _tipoCuenta,
            numeroCuenta: _numeroCuenta.text.trim(),
            alias: _alias.text.trim().isEmpty ? null : _alias.text.trim(),
            esPrincipal: _esPrincipal,
          ),
        );
      }
      ref.invalidate(cuentasBancariasProvider);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.esEdicion ? 'Cuenta actualizada' : 'Cuenta agregada',
          ),
        ),
      );
      context.pop();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(formatearErrorCuenta(e))),
      );
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }
}
