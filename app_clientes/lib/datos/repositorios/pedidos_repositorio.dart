import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/pedido.dart';

class CrearPedidoEntrada {
  CrearPedidoEntrada({
    required this.nombreCliente,
    required this.telefonoCliente,
    required this.direccionOrigen,
    required this.latitudOrigen,
    required this.longitudOrigen,
    required this.direccionDestino,
    required this.urlMapasDestino,
    required this.metodoPago,
    this.descripcionPaquete,
    this.montoContraEntrega,
    this.notasOrigen,
    this.notasDestino,
    this.foto,
  });

  final String nombreCliente;
  final String telefonoCliente;
  final String direccionOrigen;
  final double latitudOrigen;
  final double longitudOrigen;
  final String direccionDestino;
  final String urlMapasDestino;
  final String metodoPago;
  final String? descripcionPaquete;
  final double? montoContraEntrega;
  final String? notasOrigen;
  final String? notasDestino;
  final XFile? foto;

  Map<String, dynamic> aCamposMultipart() => {
        'nombreCliente': nombreCliente,
        'telefonoCliente': telefonoCliente,
        'direccionOrigen': direccionOrigen,
        'latitudOrigen': latitudOrigen.toString(),
        'longitudOrigen': longitudOrigen.toString(),
        'direccionDestino': direccionDestino,
        'urlMapasDestino': urlMapasDestino,
        'metodoPago': metodoPago,
        if (descripcionPaquete != null) 'descripcionPaquete': descripcionPaquete,
        if (montoContraEntrega != null)
          'montoContraEntrega': montoContraEntrega.toString(),
        if (notasOrigen != null) 'notasOrigen': notasOrigen,
        if (notasDestino != null) 'notasDestino': notasDestino,
      };
}

class FiltrosListadoPedidos {
  FiltrosListadoPedidos({this.estado, this.desde, this.hasta});

  final String? estado;
  final DateTime? desde;
  final DateTime? hasta;

  Map<String, dynamic> aQuery() => {
        if (estado != null) 'estado': estado,
        if (desde != null) 'desde': desde!.toIso8601String(),
        if (hasta != null) 'hasta': hasta!.toIso8601String(),
      };
}

class PedidosRepositorio {
  PedidosRepositorio(this._dio);

  final Dio _dio;

  Future<Pedido> crear(CrearPedidoEntrada entrada) async {
    final campos = entrada.aCamposMultipart();
    if (entrada.foto != null) {
      final foto = entrada.foto!;
      campos['foto'] = await MultipartFile.fromFile(
        foto.path,
        filename: foto.name,
      );
    }
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/pedidos',
      data: FormData.fromMap(campos),
    );
    return Pedido.desdeJson(respuesta.data!);
  }

  Future<List<Pedido>> listarMios({FiltrosListadoPedidos? filtros}) async {
    final respuesta = await _dio.get<dynamic>(
      '/pedidos',
      queryParameters: filtros?.aQuery(),
    );
    final datos = respuesta.data;
    final lista = datos is List
        ? datos
        : (datos is Map<String, dynamic>
            ? (datos['datos'] ?? datos['items'] ?? datos['data']) as List? ?? []
            : []);
    return lista
        .map((e) => Pedido.desdeJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Pedido> obtenerPorId(String id) async {
    final respuesta =
        await _dio.get<Map<String, dynamic>>('/pedidos/$id');
    return Pedido.desdeJson(respuesta.data!);
  }

  Future<Pedido> obtenerPorCodigoPublico(String codigo) async {
    final respuesta = await _dio.get<Map<String, dynamic>>(
      '/pedidos/seguimiento/$codigo',
      options: Options(extra: {'omitirAuth': true}),
    );
    return Pedido.desdeJson(respuesta.data!);
  }
}

final pedidosRepositorioProvider = Provider<PedidosRepositorio>((ref) {
  return PedidosRepositorio(ref.watch(dioClienteProvider));
});
