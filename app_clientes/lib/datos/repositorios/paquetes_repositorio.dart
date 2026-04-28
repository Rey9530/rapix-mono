import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/paquete_recargado.dart';

class PaquetesRepositorio {
  PaquetesRepositorio(this._dio);

  final Dio _dio;

  Future<List<ReglaTarifaPaquete>> disponibles() async {
    final respuesta =
        await _dio.get<dynamic>('/paquetes-recargados/disponibles');
    final datos = respuesta.data;
    final lista = datos is List
        ? datos
        : (datos is Map<String, dynamic>
            ? (datos['datos'] ?? datos['items'] ?? datos['data']) as List? ?? []
            : []);
    return lista
        .map((e) => ReglaTarifaPaquete.desdeJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<PaqueteRecargado> comprar({
    required String reglaTarifaId,
    required String metodoPago,
  }) async {
    final respuesta = await _dio.post<Map<String, dynamic>>(
      '/paquetes-recargados/comprar',
      data: {
        'reglaTarifaId': reglaTarifaId,
        'metodoPago': metodoPago,
      },
    );
    return PaqueteRecargado.desdeJson(respuesta.data!);
  }

  Future<List<PaqueteRecargado>> misPaquetes() async {
    final respuesta = await _dio.get<dynamic>('/paquetes-recargados/yo');
    final datos = respuesta.data;
    final lista = datos is List
        ? datos
        : (datos is Map<String, dynamic>
            ? (datos['datos'] ?? datos['items'] ?? datos['data']) as List? ?? []
            : []);
    return lista
        .map((e) => PaqueteRecargado.desdeJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<SaldoPaquetes> saldo() async {
    final respuesta =
        await _dio.get<Map<String, dynamic>>('/paquetes-recargados/yo/saldo');
    return SaldoPaquetes.desdeJson(respuesta.data!);
  }
}

final paquetesRepositorioProvider = Provider<PaquetesRepositorio>((ref) {
  return PaquetesRepositorio(ref.watch(dioClienteProvider));
});
