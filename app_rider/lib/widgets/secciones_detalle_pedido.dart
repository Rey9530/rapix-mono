import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../data/modelos/pedido.dart';
import 'utiles_estado_pedido.dart';

class FotoPaquete extends StatelessWidget {
  final String url;
  const FotoPaquete({super.key, required this.url});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => _PantallaFotoCompleta(url: url),
        ),
      ),
      child: Hero(
        tag: 'foto-paquete-$url',
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.network(
            url,
            height: 220,
            width: double.infinity,
            fit: BoxFit.cover,
            loadingBuilder: (ctx, child, progreso) {
              if (progreso == null) return child;
              return Container(
                height: 220,
                color: Colors.grey.shade200,
                child: const Center(child: CircularProgressIndicator()),
              );
            },
            errorBuilder: (ctx, _, _) => Container(
              height: 220,
              color: Colors.grey.shade200,
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.broken_image_outlined,
                        size: 48, color: Colors.grey),
                    SizedBox(height: 8),
                    Text('No se pudo cargar la foto',
                        style: TextStyle(color: Colors.grey)),
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

class _PantallaFotoCompleta extends StatelessWidget {
  final String url;
  const _PantallaFotoCompleta({required this.url});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Center(
        child: Hero(
          tag: 'foto-paquete-$url',
          child: InteractiveViewer(
            child: Image.network(url, fit: BoxFit.contain),
          ),
        ),
      ),
    );
  }
}

class CabeceraPedido extends StatelessWidget {
  final Pedido pedido;
  final IconData icono;

  const CabeceraPedido({
    super.key,
    required this.pedido,
    this.icono = Icons.archive,
  });

  @override
  Widget build(BuildContext context) {
    final color = colorEstadoPedido(pedido.estado);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    pedido.codigoSeguimiento,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      etiquetaEstadoPedido(pedido.estado),
                      style: TextStyle(
                        color: color,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Icon(icono, color: color, size: 36),
          ],
        ),
      ),
    );
  }
}

class TarjetaSeccion extends StatelessWidget {
  final String titulo;
  final IconData icono;
  final Color? colorIcono;
  final List<Widget> hijos;

  const TarjetaSeccion({
    super.key,
    required this.titulo,
    required this.icono,
    required this.hijos,
    this.colorIcono,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icono, size: 20, color: colorIcono ?? Colors.grey.shade700),
                const SizedBox(width: 8),
                Text(
                  titulo,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...hijos,
          ],
        ),
      ),
    );
  }
}

class FilaInfo extends StatelessWidget {
  final String etiqueta;
  final String valor;
  const FilaInfo({super.key, required this.etiqueta, required this.valor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          etiqueta,
          style: Theme.of(context)
              .textTheme
              .labelMedium
              ?.copyWith(color: Colors.grey),
        ),
        const SizedBox(height: 2),
        Text(valor, style: Theme.of(context).textTheme.bodyLarge),
      ],
    );
  }
}

class TarjetaCliente extends StatelessWidget {
  final Pedido pedido;
  const TarjetaCliente({super.key, required this.pedido});

  @override
  Widget build(BuildContext context) {
    return TarjetaSeccion(
      titulo: 'Cliente',
      icono: Icons.person_outline,
      hijos: [
        FilaInfo(etiqueta: 'Nombre', valor: pedido.nombreCliente!),
        if (pedido.telefonoCliente != null) ...[
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: FilaInfo(
                  etiqueta: 'Teléfono',
                  valor: pedido.telefonoCliente!,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.call, color: Colors.green),
                tooltip: 'Llamar',
                onPressed: () => _llamar(context, pedido.telefonoCliente!),
              ),
              IconButton(
                icon: const Icon(Icons.chat, color: Color(0xFF25D366)),
                tooltip: 'WhatsApp',
                onPressed: () => _whatsApp(context, pedido.telefonoCliente!),
              ),
            ],
          ),
        ],
        if (pedido.emailCliente != null) ...[
          const SizedBox(height: 8),
          FilaInfo(etiqueta: 'Email', valor: pedido.emailCliente!),
        ],
      ],
    );
  }

  Future<void> _llamar(BuildContext context, String telefono) async {
    final uri = Uri.parse('tel:${_soloDigitos(telefono)}');
    await abrirUrl(context, uri);
  }

  Future<void> _whatsApp(BuildContext context, String telefono) async {
    final numero = _telefonoConPais(telefono);
    final uri = Uri.parse('https://wa.me/$numero');
    await abrirUrl(context, uri, modo: LaunchMode.externalApplication);
  }
}

/// Tarjeta para una ubicación (origen o destino) con dirección, notas
/// opcionales y un botón que abre el mapa del punto.
class TarjetaUbicacion extends StatelessWidget {
  final String titulo;
  final IconData icono;
  final Color color;
  final String? direccion;
  final String? notas;
  final double? latitud;
  final double? longitud;
  final String etiquetaBoton;
  final bool botonPrincipal;
  final VoidCallback? onAbrirMapa;

  const TarjetaUbicacion({
    super.key,
    required this.titulo,
    required this.icono,
    required this.color,
    required this.direccion,
    required this.notas,
    required this.latitud,
    required this.longitud,
    required this.etiquetaBoton,
    required this.botonPrincipal,
    required this.onAbrirMapa,
  });

  @override
  Widget build(BuildContext context) {
    final tieneCoords = latitud != null && longitud != null;
    final boton = botonPrincipal
        ? FilledButton.icon(
            onPressed: onAbrirMapa,
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(44),
              backgroundColor: color,
            ),
            icon: const Icon(Icons.map_outlined),
            label: Text(etiquetaBoton),
          )
        : OutlinedButton.icon(
            onPressed: onAbrirMapa,
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(44),
            ),
            icon: const Icon(Icons.map_outlined),
            label: Text(etiquetaBoton),
          );

    return TarjetaSeccion(
      titulo: titulo,
      icono: icono,
      colorIcono: color,
      hijos: [
        if (direccion != null) FilaInfo(etiqueta: 'Dirección', valor: direccion!),
        if (notas != null && notas!.isNotEmpty) ...[
          const SizedBox(height: 8),
          FilaInfo(etiqueta: 'Notas', valor: notas!),
        ],
        if (tieneCoords) ...[
          const SizedBox(height: 12),
          boton,
        ],
      ],
    );
  }
}

class TarjetaPaquete extends StatelessWidget {
  final Pedido pedido;
  const TarjetaPaquete({super.key, required this.pedido});

  static bool aplicaPara(Pedido p) =>
      p.descripcionPaquete != null ||
      p.pesoPaqueteKg != null ||
      p.valorDeclarado != null;

  @override
  Widget build(BuildContext context) {
    return TarjetaSeccion(
      titulo: 'Paquete',
      icono: Icons.inventory_2_outlined,
      hijos: [
        if (pedido.descripcionPaquete != null)
          FilaInfo(etiqueta: 'Descripción', valor: pedido.descripcionPaquete!),
        if (pedido.pesoPaqueteKg != null) ...[
          const SizedBox(height: 8),
          FilaInfo(etiqueta: 'Peso', valor: '${pedido.pesoPaqueteKg} kg'),
        ],
        if (pedido.valorDeclarado != null) ...[
          const SizedBox(height: 8),
          FilaInfo(
            etiqueta: 'Valor declarado',
            valor: '\$${pedido.valorDeclarado}',
          ),
        ],
      ],
    );
  }
}

class TarjetaCobro extends StatelessWidget {
  final Pedido pedido;
  const TarjetaCobro({super.key, required this.pedido});

  @override
  Widget build(BuildContext context) {
    final esContraEntrega = pedido.metodoPago == 'CONTRA_ENTREGA';
    return TarjetaSeccion(
      titulo: 'Cobro',
      icono: Icons.payments_outlined,
      hijos: [
        if (pedido.metodoPago != null)
          FilaInfo(
            etiqueta: 'Método de pago',
            valor: _legibleMetodoPago(pedido.metodoPago!),
          ),
        if (pedido.modoFacturacion != null) ...[
          const SizedBox(height: 8),
          FilaInfo(
            etiqueta: 'Modo de facturación',
            valor: _legibleModoFacturacion(pedido.modoFacturacion!),
          ),
        ],
        if (pedido.costoEnvio != null) ...[
          const SizedBox(height: 8),
          FilaInfo(etiqueta: 'Costo de envío', valor: '\$${pedido.costoEnvio}'),
        ],
        if (pedido.montoContraEntrega != null && esContraEntrega) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.green.shade300),
            ),
            child: Row(
              children: [
                const Icon(Icons.attach_money, color: Colors.green),
                const SizedBox(width: 8),
                const Text('A cobrar al cliente:',
                    style: TextStyle(fontWeight: FontWeight.w600)),
                const Spacer(),
                Text(
                  '\$${pedido.montoContraEntrega}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class TarjetaLineaTiempo extends StatelessWidget {
  final Pedido pedido;
  const TarjetaLineaTiempo({super.key, required this.pedido});

  static bool aplicaPara(Pedido p) =>
      p.creadoEn != null ||
      p.recogidoEn != null ||
      p.enIntercambioEn != null ||
      p.entregadoEn != null;

  @override
  Widget build(BuildContext context) {
    final fmt = DateFormat('dd/MM/yyyy HH:mm');
    final eventos = <(String, DateTime)>[
      if (pedido.creadoEn != null) ('Creado', pedido.creadoEn!),
      if (pedido.recogidoEn != null) ('Recogido', pedido.recogidoEn!),
      if (pedido.enIntercambioEn != null)
        ('En punto de intercambio', pedido.enIntercambioEn!),
      if (pedido.entregadoEn != null) ('Entregado', pedido.entregadoEn!),
    ];
    return TarjetaSeccion(
      titulo: 'Línea de tiempo',
      icono: Icons.schedule,
      hijos: [
        for (var i = 0; i < eventos.length; i++) ...[
          if (i > 0) const SizedBox(height: 8),
          FilaInfo(
            etiqueta: eventos[i].$1,
            valor: fmt.format(eventos[i].$2.toLocal()),
          ),
        ],
      ],
    );
  }
}

String _legibleMetodoPago(String valor) {
  switch (valor) {
    case 'CONTRA_ENTREGA':
      return 'Contra entrega';
    case 'PAGADO_ORIGEN':
      return 'Pagado en origen';
    default:
      return valor;
  }
}

String _legibleModoFacturacion(String valor) {
  switch (valor) {
    case 'POR_ENVIO':
      return 'Por envío';
    case 'PAQUETE':
      return 'Paquete recargado';
    default:
      return valor;
  }
}

String _soloDigitos(String telefono) =>
    telefono.replaceAll(RegExp(r'[^0-9+]'), '');

// El proyecto opera principalmente en El Salvador (+503). Si el número viene
// solo con 8 dígitos locales, se prefija; si ya trae código de país (con +),
// se mantiene como está.
String _telefonoConPais(String telefono) {
  final limpio = telefono.replaceAll(RegExp(r'[^0-9]'), '');
  if (telefono.startsWith('+')) return limpio;
  if (limpio.length == 8) return '503$limpio';
  return limpio;
}

Future<void> abrirUrl(
  BuildContext context,
  Uri uri, {
  LaunchMode modo = LaunchMode.platformDefault,
}) async {
  final messenger = ScaffoldMessenger.of(context);
  try {
    final lanzado = await launchUrl(uri, mode: modo);
    if (!lanzado && context.mounted) {
      messenger.showSnackBar(
        SnackBar(content: Text('No se pudo abrir $uri')),
      );
    }
  } catch (_) {
    if (!context.mounted) return;
    messenger.showSnackBar(
      SnackBar(content: Text('No se pudo abrir $uri')),
    );
  }
}
