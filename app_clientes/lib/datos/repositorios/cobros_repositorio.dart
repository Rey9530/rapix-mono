import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/red/dio_cliente.dart';
import '../modelos/deposito.dart';

class CobrosRepositorio {
  CobrosRepositorio(this._dio);

  final Dio _dio;

  Future<SaldoPendiente> saldoPendiente() async {
    final respuesta = await _dio.get<Map<String, dynamic>>(
      '/vendedores/yo/saldo-pendiente',
    );
    return SaldoPendiente.desdeJson(respuesta.data!);
  }

  Future<PaginaDepositos> historial({
    int pagina = 1,
    int limite = 20,
    DateTime? desde,
    DateTime? hasta,
  }) async {
    final respuesta = await _dio.get<Map<String, dynamic>>(
      '/vendedores/yo/historial-depositos',
      queryParameters: {
        'pagina': pagina,
        'limite': limite,
        if (desde != null) 'desde': desde.toIso8601String(),
        if (hasta != null) 'hasta': hasta.toIso8601String(),
      },
    );
    return PaginaDepositos.desdeJson(respuesta.data!);
  }
}

final cobrosRepositorioProvider = Provider<CobrosRepositorio>((ref) {
  return CobrosRepositorio(ref.watch(dioClienteProvider));
});
