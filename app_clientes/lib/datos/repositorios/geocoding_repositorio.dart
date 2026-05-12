import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../nucleo/config/entorno.dart';

class ResultadoGeocoding {
  ResultadoGeocoding({
    required this.direccion,
    required this.latitud,
    required this.longitud,
    this.contexto,
  });

  final String direccion;
  final double latitud;
  final double longitud;
  final String? contexto;
}

class GeocodingRepositorio {
  GeocodingRepositorio(this._dio);

  final Dio _dio;

  Future<List<ResultadoGeocoding>> buscar(
    String consulta, {
    String idioma = 'es',
    String pais = 'sv',
    int limite = 5,
    double? proximidadLat,
    double? proximidadLng,
  }) async {
    final texto = consulta.trim();
    if (texto.length < 3) return const [];

    final params = <String, dynamic>{
      'q': texto,
      'language': idioma,
      'country': pais,
      'limit': limite,
      'access_token': Entorno.tokenMapbox,
    };
    if (proximidadLat != null && proximidadLng != null) {
      params['proximity'] = '$proximidadLng,$proximidadLat';
    }

    final respuesta = await _dio.get<Map<String, dynamic>>(
      'https://api.mapbox.com/search/searchbox/v1/forward',
      queryParameters: params,
    );
    final features = respuesta.data?['features'] as List? ?? const [];
    return features
        .map((raw) => _parsear(raw as Map<String, dynamic>))
        .whereType<ResultadoGeocoding>()
        .toList();
  }

  ResultadoGeocoding? _parsear(Map<String, dynamic> feature) {
    final geometry = feature['geometry'] as Map<String, dynamic>?;
    final coords = geometry?['coordinates'] as List?;
    if (coords == null || coords.length < 2) return null;
    final lng = (coords[0] as num).toDouble();
    final lat = (coords[1] as num).toDouble();

    final properties = feature['properties'] as Map<String, dynamic>? ?? const {};
    final direccion = (properties['full_address'] ??
            properties['place_formatted'] ??
            properties['name']) as String?;
    if (direccion == null || direccion.isEmpty) return null;

    return ResultadoGeocoding(
      direccion: direccion,
      latitud: lat,
      longitud: lng,
      contexto: properties['place_formatted'] as String?,
    );
  }
}

final geocodingRepositorioProvider = Provider<GeocodingRepositorio>((ref) {
  return GeocodingRepositorio(Dio(BaseOptions(
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
  )));
});
