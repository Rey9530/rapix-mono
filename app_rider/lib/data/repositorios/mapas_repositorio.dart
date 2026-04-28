import 'package:dio/dio.dart';
import '../modelos/ruta_optimizada.dart';

class MapasRepositorio {
  final Dio _dio;

  MapasRepositorio({required Dio dio}) : _dio = dio;

  Future<RutaOptimizada> optimizarRuta(
    List<({double latitud, double longitud})> puntos,
  ) async {
    final r = await _dio.post<Map<String, dynamic>>(
      '/mapas/optimizar-ruta',
      data: {
        'puntos': puntos
            .map((p) => {'latitud': p.latitud, 'longitud': p.longitud})
            .toList(),
      },
    );
    return RutaOptimizada.fromJson(r.data!);
  }
}
