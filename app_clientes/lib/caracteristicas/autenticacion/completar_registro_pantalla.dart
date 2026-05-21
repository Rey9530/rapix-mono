import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mapbox_maps_flutter/mapbox_maps_flutter.dart' as mb;

import '../../nucleo/tema/tokens_rapix.dart';
import 'autenticacion_controlador.dart';
import 'widgets/campos_autenticacion.dart';

/// Pantalla mostrada cuando el usuario inicio sesion via Google pero aun
/// no tiene `registroCompleto = true`. Pide los datos obligatorios que
/// Google no provee (telefono + datos del negocio + ubicacion). Bloquea
/// la navegacion hacia atras hasta que el registro este completo: el
/// estado de verdad es el backend, no el cliente.
class CompletarRegistroPantalla extends ConsumerStatefulWidget {
  const CompletarRegistroPantalla({super.key});

  @override
  ConsumerState<CompletarRegistroPantalla> createState() =>
      _CompletarRegistroPantallaEstado();
}

class _CompletarRegistroPantallaEstado
    extends ConsumerState<CompletarRegistroPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _telefonoCtrl = TextEditingController();
  final _negocioCtrl = TextEditingController();
  final _direccionCtrl = TextEditingController();

  mb.Point? _ubicacionTienda;

  @override
  void dispose() {
    _telefonoCtrl.dispose();
    _negocioCtrl.dispose();
    _direccionCtrl.dispose();
    super.dispose();
  }

  Future<void> _elegirUbicacion() async {
    final resultado = await context.push<mb.Point>(
      '/seleccionar-ubicacion',
      extra: {
        'titulo': 'Ubicación de la tienda',
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
      _avisar('Selecciona la ubicación de la tienda en el mapa');
      return;
    }
    final ok = await ref
        .read(autenticacionControladorProvider.notifier)
        .completarRegistro(
          telefono: _telefonoCtrl.text.trim(),
          nombreNegocio: _negocioCtrl.text.trim(),
          direccion: _direccionCtrl.text.trim(),
          latitud: _ubicacionTienda!.coordinates.lat.toDouble(),
          longitud: _ubicacionTienda!.coordinates.lng.toDouble(),
        );
    if (!mounted) return;
    if (!ok) {
      final error = ref.read(autenticacionControladorProvider).error;
      if (error != null) _avisar(error);
    }
    // En exito no navegamos manualmente: el router redirige a /inicio
    // automaticamente al cambiar registroCompleto a true.
  }

  void _avisar(String mensaje) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(mensaje)));
  }

  @override
  Widget build(BuildContext context) {
    final estado = ref.watch(autenticacionControladorProvider);
    final usuario = estado.usuario;
    // canPop:false bloquea el boton atras del sistema y el gesto de swipe
    // mientras el registro no este completo.
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: tokens(context).fondo,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: tokens(context).fondo,
          toolbarHeight: 64,
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Completa tu registro',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: tokens(context).tinta,
                  letterSpacing: -0.2,
                ),
              ),
              Text(
                'Falta poco para empezar a vender',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: tokens(context).tintaSilenciada,
                ),
              ),
            ],
          ),
        ),
        body: Form(
          key: _formulario,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
            children: [
              if (usuario != null) _TarjetaIdentidadGoogle(
                nombre: usuario.nombreCompleto,
                email: usuario.email,
                urlAvatar: usuario.urlAvatar,
              ),
              const SizedBox(height: 22),
              const _TituloSeccion(
                titulo: 'Tu telefono',
                descripcion:
                    'Lo usaremos para enviarte avisos por WhatsApp sobre tus pedidos.',
              ),
              const SizedBox(height: 14),
              CampoEtiquetado(
                etiqueta: 'Teléfono (WhatsApp)',
                hint: '70001234',
                controlador: _telefonoCtrl,
                tipoTeclado: TextInputType.phone,
                autofill: const [AutofillHints.telephoneNumber],
                validador: (v) {
                  final t = v?.trim() ?? '';
                  if (!RegExp(r'^[267][0-9]{7}$').hasMatch(t)) {
                    return 'Debe tener 8 dígitos y empezar con 2, 6 o 7';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 28),
              const _TituloSeccion(
                titulo: 'Tu negocio',
                descripcion:
                    'Aparecerá en el seguimiento que ven tus clientes.',
              ),
              const SizedBox(height: 14),
              CampoEtiquetado(
                etiqueta: 'Nombre del negocio',
                hint: 'Florería Luna',
                controlador: _negocioCtrl,
                capitalizacion: TextCapitalization.words,
                validador: (v) => (v == null || v.trim().isEmpty)
                    ? 'Ingresa el nombre del negocio'
                    : null,
              ),
              const SizedBox(height: 14),
              CampoEtiquetado(
                etiqueta: 'Dirección',
                hint: 'Av. Insurgentes 247',
                controlador: _direccionCtrl,
                capitalizacion: TextCapitalization.sentences,
                validador: (v) => (v == null || v.trim().isEmpty)
                    ? 'Ingresa la dirección'
                    : null,
              ),
              const SizedBox(height: 14),
              TarjetaUbicacion(
                ubicacion: _ubicacionTienda,
                alPresionar: _elegirUbicacion,
              ),
            ],
          ),
        ),
        bottomNavigationBar: _PieCompletar(
          cargando: estado.cargando,
          habilitado: !estado.cargando,
          alPresionar: _enviar,
        ),
      ),
    );
  }
}

class _TarjetaIdentidadGoogle extends StatelessWidget {
  const _TarjetaIdentidadGoogle({
    required this.nombre,
    required this.email,
    required this.urlAvatar,
  });

  final String nombre;
  final String email;
  final String? urlAvatar;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        borderRadius: BorderRadius.circular(TokensRapix.radioLg),
        border: Border.all(color: tokens(context).contornoSuave),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: tokens(context).verdeSuave,
            backgroundImage:
                (urlAvatar != null && urlAvatar!.isNotEmpty)
                    ? NetworkImage(urlAvatar!)
                    : null,
            child: (urlAvatar == null || urlAvatar!.isEmpty)
                ? Text(
                    nombre.isNotEmpty ? nombre[0].toUpperCase() : '?',
                    style: GoogleFonts.inter(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: TokensRapix.verdeOscuro,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  nombre,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: tokens(context).tinta,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  email,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: tokens(context).tintaSilenciada,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  'Verificado con Google',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: TokensRapix.verdeOscuro,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TituloSeccion extends StatelessWidget {
  const _TituloSeccion({required this.titulo, required this.descripcion});

  final String titulo;
  final String descripcion;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          titulo,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            letterSpacing: -0.3,
            color: tokens(context).tinta,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          descripcion,
          style: GoogleFonts.inter(
            fontSize: 12,
            color: tokens(context).tintaSilenciada,
            height: 1.4,
          ),
        ),
      ],
    );
  }
}

class _PieCompletar extends StatelessWidget {
  const _PieCompletar({
    required this.cargando,
    required this.habilitado,
    required this.alPresionar,
  });

  final bool cargando;
  final bool habilitado;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: tokens(context).superficie,
        border: Border(
          top: BorderSide(color: tokens(context).contornoSuave),
        ),
      ),
      child: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(22, 14, 22, 18),
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            boxShadow: habilitado
                ? [
                    BoxShadow(
                      color: TokensRapix.verde.withValues(alpha: 0.28),
                      offset: const Offset(0, 6),
                      blurRadius: 16,
                    ),
                  ]
                : null,
          ),
          child: FilledButton(
            onPressed: habilitado ? alPresionar : null,
            child: cargando
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Text('Completar registro'),
                      SizedBox(width: 8),
                      Icon(Icons.chevron_right, size: 20),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
