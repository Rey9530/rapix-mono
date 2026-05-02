import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../datos/repositorios/pedidos_repositorio.dart';
import '../../nucleo/tema/tokens_rapix.dart';
import '../autenticacion/autenticacion_controlador.dart';
import 'pedidos_listado_controlador.dart';

final _regexUrlMapsCorta =
    RegExp(r'^https://maps\.app\.goo\.gl/[A-Za-z0-9_-]+/?$');

class CrearPedidoPantalla extends ConsumerStatefulWidget {
  const CrearPedidoPantalla({super.key});

  @override
  ConsumerState<CrearPedidoPantalla> createState() =>
      _CrearPedidoPantallaEstado();
}

class _CrearPedidoPantallaEstado extends ConsumerState<CrearPedidoPantalla> {
  final _formulario = GlobalKey<FormState>();
  final _nombreCliente = TextEditingController();
  final _telefonoCliente = TextEditingController();
  final _direccionDestino = TextEditingController();
  final _urlMapsDestino = TextEditingController();
  final _descripcion = TextEditingController();
  final _montoContraEntrega = TextEditingController();
  final _notasDestino = TextEditingController();

  String _metodoPago = 'CONTRA_ENTREGA';
  XFile? _foto;
  bool _enviando = false;
  final _selectorImagen = ImagePicker();

  @override
  void dispose() {
    _nombreCliente.dispose();
    _telefonoCliente.dispose();
    _direccionDestino.dispose();
    _urlMapsDestino.dispose();
    _descripcion.dispose();
    _montoContraEntrega.dispose();
    _notasDestino.dispose();
    super.dispose();
  }

  Future<void> _elegirFoto() async {
    final origen = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: TokensRapix.superficie,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: TokensRapix.contorno,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 8),
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
        maxWidth: 1600,
        imageQuality: 80,
      );
      if (imagen != null) {
        setState(() => _foto = imagen);
      }
    } catch (e) {
      if (!mounted) return;
      _mostrarSnack('No se pudo abrir el selector: $e');
    }
  }

  Future<void> _pegarLink() async {
    final datos = await Clipboard.getData(Clipboard.kTextPlain);
    final texto = datos?.text?.trim() ?? '';
    if (texto.isEmpty) {
      _mostrarSnack('No hay texto en el portapapeles');
      return;
    }
    setState(() => _urlMapsDestino.text = texto);
    _mostrarSnack('Link pegado');
  }

  void _mostrarProximamente(String funcionalidad) {
    _mostrarSnack('$funcionalidad — próximamente');
  }

  void _mostrarSnack(String texto) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(texto)),
    );
  }

  Future<void> _enviar() async {
    if (!_formulario.currentState!.validate()) return;
    final auth = ref.read(autenticacionControladorProvider);
    final perfil = auth.usuario?.perfilVendedor;
    if (perfil?.latitud == null || perfil?.longitud == null) {
      _mostrarSnack(
        'Tu cuenta no tiene ubicación de tienda. Actualiza tu perfil.',
      );
      return;
    }

    setState(() => _enviando = true);
    try {
      final repo = ref.read(pedidosRepositorioProvider);
      final pedido = await repo.crear(
        CrearPedidoEntrada(
          nombreCliente: _nombreCliente.text.trim(),
          telefonoCliente: _telefonoCliente.text.trim(),
          direccionOrigen: perfil!.direccion ?? 'Tienda',
          latitudOrigen: perfil.latitud!,
          longitudOrigen: perfil.longitud!,
          direccionDestino: _direccionDestino.text.trim(),
          urlMapasDestino: _urlMapsDestino.text.trim(),
          metodoPago: _metodoPago,
          descripcionPaquete: _descripcion.text.trim().isEmpty
              ? null
              : _descripcion.text.trim(),
          montoContraEntrega: _metodoPago == 'CONTRA_ENTREGA'
              ? double.tryParse(_montoContraEntrega.text)
              : null,
          notasDestino: _notasDestino.text.trim().isEmpty
              ? null
              : _notasDestino.text.trim(),
          foto: _foto,
        ),
      );
      if (!mounted) return;
      ref.invalidate(pedidosListadoProvider);
      context.go('/pedidos/${pedido.id}');
    } on DioException catch (e) {
      if (!mounted) return;
      _mostrarSnack(_mensajeError(e));
    } finally {
      if (mounted) setState(() => _enviando = false);
    }
  }

  String _mensajeError(DioException e) {
    final datos = e.response?.data;
    if (datos is Map<String, dynamic>) {
      final codigo = datos['codigo'] as String?;
      final mensaje = datos['mensaje'] ?? datos['message'];
      if (codigo == 'PEDIDO_ZONA_INVALIDA' ||
          codigo == 'PEDIDO_ZONA_INVALIDA_DESTINO') {
        return 'La dirección de destino está fuera de la zona de cobertura';
      }
      if (codigo == 'PEDIDO_URL_MAPAS_INVALIDA') {
        return 'No se pudo leer la ubicación desde la URL de Google Maps. '
            'Verifica el enlace.';
      }
      if (mensaje is String && mensaje.isNotEmpty) return mensaje;
      if (mensaje is List && mensaje.isNotEmpty) return mensaje.first.toString();
    }
    return 'No se pudo crear el pedido. Intenta de nuevo.';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TokensRapix.fondo,
      appBar: AppBar(
        title: const Text('Nuevo pedido'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, size: 22),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        bottom: false,
        child: Form(
          key: _formulario,
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _SeccionNumerada(
                  numero: '1',
                  titulo: 'CLIENTE',
                  hijos: [
                    _CampoFormulario(
                      etiqueta: 'NOMBRE COMPLETO',
                      icono: Icons.person_outline,
                      controlador: _nombreCliente,
                      capitalizacion: TextCapitalization.words,
                      validador: (v) => (v == null || v.trim().isEmpty)
                          ? 'Requerido'
                          : null,
                    ),
                    _CampoFormulario(
                      etiqueta: 'TELÉFONO',
                      icono: Icons.phone_outlined,
                      controlador: _telefonoCliente,
                      teclado: TextInputType.phone,
                      hint: '+50370001234',
                      ultimo: true,
                      validador: (v) {
                        final t = v?.trim() ?? '';
                        if (!RegExp(r'^\+?[0-9]{8,15}$').hasMatch(t)) {
                          return '8-15 dígitos, opcional con +';
                        }
                        return null;
                      },
                    ),
                  ],
                ),
                _SeccionNumerada(
                  numero: '2',
                  titulo: 'DESTINO',
                  hijos: [
                    const _MapaPreview(),
                    _CampoFormulario(
                      etiqueta: 'DIRECCIÓN',
                      icono: Icons.place_outlined,
                      controlador: _direccionDestino,
                      hint: 'Calle, colonia, referencias',
                      validador: (v) => (v == null || v.trim().isEmpty)
                          ? 'Requerido'
                          : null,
                    ),
                    _BarraChipsAccion(
                      chips: [
                        _ChipAccion(
                          icono: Icons.content_paste_outlined,
                          etiqueta: 'Pegar link',
                          alPresionar: _pegarLink,
                        ),
                        _ChipAccion(
                          icono: Icons.my_location,
                          etiqueta: 'Mi ubicación',
                          alPresionar: () =>
                              _mostrarProximamente('Selección por GPS'),
                        ),
                      ],
                    ),
                    _CampoFormulario(
                      etiqueta: 'URL DE GOOGLE MAPS',
                      icono: Icons.link,
                      controlador: _urlMapsDestino,
                      teclado: TextInputType.url,
                      hint: 'https://maps.app.goo.gl/...',
                      validador: (v) {
                        final t = v?.trim() ?? '';
                        if (t.isEmpty) {
                          return 'Pega la URL de Google Maps del destino';
                        }
                        if (!_regexUrlMapsCorta.hasMatch(t)) {
                          return 'URL inválida. Comparte el sitio desde Google '
                              'Maps y pega el enlace corto';
                        }
                        return null;
                      },
                    ),
                    _CampoFormulario(
                      etiqueta: 'NOTAS PARA EL REPARTIDOR',
                      icono: Icons.sticky_note_2_outlined,
                      controlador: _notasDestino,
                      multilinea: true,
                      hint: 'Opcional · Portón verde, tocar timbre 2 veces…',
                      ultimo: true,
                    ),
                  ],
                ),
                _SeccionNumerada(
                  numero: '3',
                  titulo: 'PAQUETE',
                  hijos: [
                    _FilaFoto(
                      foto: _foto,
                      alPresionar: _elegirFoto,
                      alQuitar: () => setState(() => _foto = null),
                    ),
                    _CampoFormulario(
                      etiqueta: 'DESCRIPCIÓN',
                      icono: Icons.inventory_2_outlined,
                      controlador: _descripcion,
                      hint: 'Opcional · ¿Qué contiene el paquete?',
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          _EtiquetaSeccion('MÉTODO DE PAGO'),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: _OpcionPago(
                                  etiqueta: 'Contra entrega',
                                  icono: Icons.payments_outlined,
                                  seleccionado:
                                      _metodoPago == 'CONTRA_ENTREGA',
                                  alPresionar: () => setState(
                                    () => _metodoPago = 'CONTRA_ENTREGA',
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: _OpcionPago(
                                  etiqueta: 'Prepagado',
                                  icono: Icons.credit_card,
                                  seleccionado: _metodoPago == 'PREPAGADO',
                                  alPresionar: () => setState(
                                    () => _metodoPago = 'PREPAGADO',
                                  ),
                                ),
                              ),
                            ],
                          ),
                          if (_metodoPago == 'CONTRA_ENTREGA') ...[
                            const SizedBox(height: 14),
                            _EtiquetaSeccion('MONTO A COBRAR'),
                            const SizedBox(height: 6),
                            _CampoMonto(
                              controlador: _montoContraEntrega,
                              validador: (v) {
                                if (_metodoPago != 'CONTRA_ENTREGA') {
                                  return null;
                                }
                                final monto = double.tryParse(v ?? '');
                                if (monto == null || monto <= 0) {
                                  return 'Monto inválido';
                                }
                                return null;
                              },
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _BarraInferiorCrear(
        cargando: _enviando,
        alPresionar: _enviando ? null : _enviar,
      ),
    );
  }
}

class _SeccionNumerada extends StatelessWidget {
  const _SeccionNumerada({
    required this.numero,
    required this.titulo,
    required this.hijos,
  });

  final String numero;
  final String titulo;
  final List<Widget> hijos;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 4, 10),
            child: Row(
              children: [
                Container(
                  width: 22,
                  height: 22,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: TokensRapix.verdeSuave,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    numero,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: TokensRapix.verdeOscuro,
                      height: 1,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  titulo,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: TokensRapix.tinta,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: TokensRapix.superficie,
              borderRadius: BorderRadius.circular(TokensRapix.radioLg),
              border: Border.all(color: TokensRapix.contorno),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: hijos,
            ),
          ),
        ],
      ),
    );
  }
}

class _CampoFormulario extends StatelessWidget {
  const _CampoFormulario({
    required this.etiqueta,
    required this.icono,
    required this.controlador,
    this.teclado,
    this.hint,
    this.multilinea = false,
    this.capitalizacion,
    this.validador,
    this.ultimo = false,
  });

  final String etiqueta;
  final IconData icono;
  final TextEditingController controlador;
  final TextInputType? teclado;
  final String? hint;
  final bool multilinea;
  final TextCapitalization? capitalizacion;
  final String? Function(String?)? validador;
  final bool ultimo;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: ultimo
            ? null
            : const Border(
                bottom: BorderSide(color: TokensRapix.contornoSuave),
              ),
      ),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 18),
            child: Icon(
              icono,
              size: 18,
              color: TokensRapix.tintaSilenciada,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  etiqueta,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: TokensRapix.tintaSilenciada,
                    letterSpacing: 0.4,
                  ),
                ),
                const SizedBox(height: 3),
                TextFormField(
                  controller: controlador,
                  keyboardType: teclado,
                  textCapitalization:
                      capitalizacion ?? TextCapitalization.none,
                  maxLines: multilinea ? 3 : 1,
                  minLines: multilinea ? 1 : 1,
                  validator: validador,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: TokensRapix.tinta,
                    height: 1.3,
                  ),
                  decoration: InputDecoration(
                    hintText: hint,
                    hintStyle: GoogleFonts.inter(
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                      color: TokensRapix.tintaSuave,
                    ),
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                    focusedErrorBorder: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                    filled: false,
                    errorStyle: GoogleFonts.inter(
                      fontSize: 11,
                      color: TokensRapix.peligro,
                    ),
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

class _MapaPreview extends StatelessWidget {
  const _MapaPreview();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 160,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFE8F0E6), Color(0xFFD8E6DB)],
        ),
        border: Border(
          bottom: BorderSide(color: TokensRapix.contornoSuave),
        ),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(painter: _CallesPainter()),
          ),
          Positioned(
            top: 10,
            left: 10,
            right: 10,
            child: GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Búsqueda de direcciones — próximamente'),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: TokensRapix.superficie,
                  borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x1A000000),
                      offset: Offset(0, 2),
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.search,
                      size: 16,
                      color: TokensRapix.tintaSilenciada,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Buscar dirección…',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: TokensRapix.tintaSilenciada,
                        ),
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 16,
                      color: TokensRapix.contorno,
                    ),
                    const SizedBox(width: 8),
                    const Icon(
                      Icons.map_outlined,
                      size: 16,
                      color: TokensRapix.verde,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const Align(
            alignment: Alignment(0, -0.1),
            child: Icon(
              Icons.location_on,
              size: 36,
              color: TokensRapix.verde,
              shadows: [
                Shadow(
                  color: Color(0x4D000000),
                  offset: Offset(0, 2),
                  blurRadius: 4,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CallesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final pintura = Paint()
      ..color = Colors.white.withValues(alpha: 0.7)
      ..strokeWidth = 14;
    canvas.drawLine(
      const Offset(-20, 60),
      Offset(size.width + 20, 90),
      pintura,
    );
    pintura.strokeWidth = 10;
    canvas.drawLine(
      const Offset(40, -10),
      Offset(100, size.height + 10),
      pintura,
    );
    canvas.drawLine(
      const Offset(200, -10),
      Offset(260, size.height + 10),
      pintura,
    );

    pintura.color = Colors.white.withValues(alpha: 0.5);
    pintura.strokeWidth = 8;
    canvas.drawLine(
      const Offset(-20, 130),
      Offset(size.width + 20, 110),
      pintura,
    );
    canvas.drawLine(
      const Offset(320, -10),
      Offset(350, size.height + 10),
      pintura,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _BarraChipsAccion extends StatelessWidget {
  const _BarraChipsAccion({required this.chips});

  final List<Widget> chips;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: TokensRapix.contornoSuave),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(14, 8, 14, 12),
      child: Wrap(
        spacing: 6,
        runSpacing: 6,
        children: chips,
      ),
    );
  }
}

class _ChipAccion extends StatelessWidget {
  const _ChipAccion({
    required this.icono,
    required this.etiqueta,
    required this.alPresionar,
  });

  final IconData icono;
  final String etiqueta;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      borderRadius: BorderRadius.circular(TokensRapix.radioPill),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: TokensRapix.superficieAlt,
          borderRadius: BorderRadius.circular(TokensRapix.radioPill),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icono, size: 13, color: TokensRapix.tinta),
            const SizedBox(width: 6),
            Text(
              etiqueta,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: TokensRapix.tinta,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FilaFoto extends StatelessWidget {
  const _FilaFoto({
    required this.foto,
    required this.alPresionar,
    required this.alQuitar,
  });

  final XFile? foto;
  final VoidCallback alPresionar;
  final VoidCallback alQuitar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      child: Container(
        decoration: const BoxDecoration(
          border: Border(
            bottom: BorderSide(color: TokensRapix.contornoSuave),
          ),
        ),
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: Row(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: TokensRapix.superficieHundida,
                borderRadius: BorderRadius.circular(TokensRapix.radioMd),
                image: foto != null
                    ? DecorationImage(
                        image: FileImage(File(foto!.path)),
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
              child: foto == null
                  ? const Icon(
                      Icons.photo_camera_outlined,
                      size: 20,
                      color: TokensRapix.tintaSilenciada,
                    )
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Foto del paquete',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: TokensRapix.tinta,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    foto == null
                        ? 'Opcional · Cámara o galería'
                        : 'Toca para reemplazar',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: TokensRapix.tintaSilenciada,
                    ),
                  ),
                ],
              ),
            ),
            if (foto != null)
              IconButton(
                tooltip: 'Quitar foto',
                onPressed: alQuitar,
                icon: const Icon(Icons.close, size: 18),
                color: TokensRapix.tintaSilenciada,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(
                  minWidth: 32,
                  minHeight: 32,
                ),
              )
            else
              const Icon(
                Icons.chevron_right,
                size: 18,
                color: TokensRapix.tintaSuave,
              ),
          ],
        ),
      ),
    );
  }
}

class _EtiquetaSeccion extends StatelessWidget {
  const _EtiquetaSeccion(this.texto);

  final String texto;

  @override
  Widget build(BuildContext context) {
    return Text(
      texto,
      style: GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: TokensRapix.tintaSilenciada,
        letterSpacing: 0.4,
      ),
    );
  }
}

class _OpcionPago extends StatelessWidget {
  const _OpcionPago({
    required this.etiqueta,
    required this.icono,
    required this.seleccionado,
    required this.alPresionar,
  });

  final String etiqueta;
  final IconData icono;
  final bool seleccionado;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: alPresionar,
      borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
        decoration: BoxDecoration(
          color: seleccionado
              ? TokensRapix.verdeSuave
              : TokensRapix.superficie,
          borderRadius: BorderRadius.circular(TokensRapix.radioMd),
          border: Border.all(
            color: seleccionado ? TokensRapix.verde : TokensRapix.contorno,
            width: seleccionado ? 1.5 : 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icono,
              size: 20,
              color: seleccionado
                  ? TokensRapix.verdeOscuro
                  : TokensRapix.tintaSilenciada,
            ),
            const SizedBox(height: 4),
            Text(
              etiqueta,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight:
                    seleccionado ? FontWeight.w700 : FontWeight.w600,
                color: seleccionado
                    ? TokensRapix.verdeOscuro
                    : TokensRapix.tintaSilenciada,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CampoMonto extends StatelessWidget {
  const _CampoMonto({
    required this.controlador,
    required this.validador,
  });

  final TextEditingController controlador;
  final String? Function(String?)? validador;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: TokensRapix.superficieAlt,
        borderRadius: BorderRadius.circular(TokensRapix.radioMd),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.baseline,
        textBaseline: TextBaseline.alphabetic,
        children: [
          Text(
            r'$',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: TokensRapix.tintaSilenciada,
            ),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: TextFormField(
              controller: controlador,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              validator: validador,
              style: GoogleFonts.inter(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: TokensRapix.tinta,
                letterSpacing: -0.5,
                height: 1.1,
              ),
              decoration: InputDecoration(
                hintText: '0.00',
                hintStyle: GoogleFonts.inter(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: TokensRapix.tintaSuave,
                  letterSpacing: -0.5,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                errorBorder: InputBorder.none,
                focusedErrorBorder: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
                filled: false,
                errorStyle: GoogleFonts.inter(
                  fontSize: 11,
                  color: TokensRapix.peligro,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BarraInferiorCrear extends StatelessWidget {
  const _BarraInferiorCrear({
    required this.cargando,
    required this.alPresionar,
  });

  final bool cargando;
  final VoidCallback? alPresionar;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: TokensRapix.superficie,
        border: Border(
          top: BorderSide(color: TokensRapix.contorno),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Costará',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: TokensRapix.tintaSilenciada,
                      ),
                    ),
                    Text(
                      '1 envío del paquete',
                      style: GoogleFonts.inter(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: TokensRapix.tinta,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              FilledButton(
                onPressed: alPresionar,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 22,
                    vertical: 14,
                  ),
                  minimumSize: Size.zero,
                ),
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
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Text('Crear pedido'),
                          SizedBox(width: 6),
                          Icon(Icons.chevron_right, size: 18),
                        ],
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
