import 'package:dio/dio.dart';

import '../modelos/movimiento_caja.dart';

class BilleteraRepositorio {
  final Dio _dio;

  BilleteraRepositorio({required Dio dio}) : _dio = dio;

  Future<List<MovimientoCaja>> pendientes() async {
    final r =
        await _dio.get<List<dynamic>>('/billetera/yo/pendientes');
    return (r.data ?? [])
        .cast<Map<String, dynamic>>()
        .map(MovimientoCaja.desdeJsonAnidado)
        .toList();
  }

  Future<SaldoPendiente> saldoPendiente() async {
    final r = await _dio.get<Map<String, dynamic>>(
      '/billetera/yo/saldo-pendiente',
    );
    return SaldoPendiente.fromJson(r.data!);
  }

  Future<List<MovimientoCaja>> historial({int pagina = 1, int limite = 20}) async {
    final r = await _dio.get<Map<String, dynamic>>(
      '/billetera/yo/historial',
      queryParameters: {'pagina': pagina, 'limite': limite},
    );
    final datos = (r.data?['datos'] as List?)?.cast<Map<String, dynamic>>() ?? [];
    return datos.map(MovimientoCaja.desdeJsonAnidado).toList();
  }
}
