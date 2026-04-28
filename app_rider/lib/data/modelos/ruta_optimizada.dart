import 'package:freezed_annotation/freezed_annotation.dart';

part 'ruta_optimizada.freezed.dart';
part 'ruta_optimizada.g.dart';

@freezed
class RutaOptimizada with _$RutaOptimizada {
  const factory RutaOptimizada({
    required String geometriaPolyline,
    required double distanciaMetros,
    required double duracionSegundos,
    required List<int> ordenWaypoints,
  }) = _RutaOptimizada;

  factory RutaOptimizada.fromJson(Map<String, dynamic> json) =>
      _$RutaOptimizadaFromJson(json);
}
