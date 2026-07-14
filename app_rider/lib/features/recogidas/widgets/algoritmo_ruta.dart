import 'dart:math' as math;

import '../../../data/modelos/pedido.dart';

/// Distancia (en metros) a la que se considera que el repartidor "llegó" a una
/// parada de la ruta (tienda en recogidas, cliente en entregas) y se
/// dispara la acción asociada (recoger automáticamente o marcar visita).
const double kRadioGeofenceMetros = 50.0;

/// Distancia mínima que debe recorrer el repartidor antes de volver a centrar
/// la cámara del mapa en su posición. Evita animar la vista en cada tick del
/// stream de GPS cuando el movimiento real es despreciable.
const double kUmbralDistanciaMinimaMetros = 25.0;

/// Distancia en metros entre dos coordenadas usando la fórmula de haversine.
double distanciaMetrosHaversine(
  double lat1,
  double lng1,
  double lat2,
  double lng2,
) {
  const radioTierraMetros = 6371000.0;
  final dLat = _gradosARadianes(lat2 - lat1);
  final dLng = _gradosARadianes(lng2 - lng1);
  final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
      math.cos(_gradosARadianes(lat1)) *
          math.cos(_gradosARadianes(lat2)) *
          math.sin(dLng / 2) *
          math.sin(dLng / 2);
  final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  return radioTierraMetros * c;
}

/// Heurística del vecino más cercano. Devuelve las paradas (Pedido) en el orden
/// en que deberían visitarse empezando desde [latitudOrigen]/[longitudOrigen].
///
/// - Filtra los pedidos sin coordenadas válidas (no pueden ubicarse en el mapa).
/// - Si no hay coordenadas del repartidor, devuelve las paradas válidas en el
///   orden de entrada.
/// - En cada iteración elige la parada más cercana al "punto actual" (la
///   posición inicial del rider, o la última parada visitada).
///
/// Por defecto usa las coordenadas de **origen** del pedido (la tienda), que
/// es lo que necesita la vista de recogidas. Para entregas, pasa los
/// selectores apuntando al destino (cliente):
///
/// ```dart
/// calcularRutaVecinoMasCercano(
///   paradas: lista,
///   latitudOrigen: riderLat,
///   longitudOrigen: riderLng,
///   tieneCoordenadas: (p) => p.tieneCoordenadasDestino,
///   selectorLatitud: (p) => p.latitudDestino,
///   selectorLongitud: (p) => p.longitudDestino,
/// );
/// ```
List<Pedido> calcularRutaVecinoMasCercano({
  double? latitudOrigen,
  double? longitudOrigen,
  required List<Pedido> paradas,
  bool Function(Pedido)? tieneCoordenadas,
  double? Function(Pedido)? selectorLatitud,
  double? Function(Pedido)? selectorLongitud,
}) {
  final filtro = tieneCoordenadas ?? (p) => p.tieneCoordenadasOrigen;
  final latitud = selectorLatitud ?? (p) => p.latitudOrigen;
  final longitud = selectorLongitud ?? (p) => p.longitudOrigen;

  final validas = paradas.where(filtro).toList();
  if (validas.isEmpty) return const [];

  final hayOrigen = latitudOrigen != null && longitudOrigen != null;
  if (!hayOrigen) return validas;

  final restantes = [...validas];
  final resultado = <Pedido>[];
  double latActual = latitudOrigen;
  double lngActual = longitudOrigen;

  while (restantes.isNotEmpty) {
    var mejorIndice = 0;
    var mejorDistancia = double.infinity;
    for (var i = 0; i < restantes.length; i++) {
      final p = restantes[i];
      final d = distanciaMetrosHaversine(
        latActual,
        lngActual,
        latitud(p)!,
        longitud(p)!,
      );
      if (d < mejorDistancia) {
        mejorDistancia = d;
        mejorIndice = i;
      }
    }
    final siguiente = restantes.removeAt(mejorIndice);
    resultado.add(siguiente);
    latActual = latitud(siguiente)!;
    lngActual = longitud(siguiente)!;
  }

  return resultado;
}

/// Agrupa los pedidos de una ruta por `vendedorId`, conservando el orden de
/// visita calculado. Cada elemento del resultado representa una "parada de
/// tienda" con todos sus pedidos. Pedidos sin `vendedorId` caen en el grupo
/// `__sin_vendedor__`.
List<List<Pedido>> agruparPorTienda(List<Pedido> ruta) {
  if (ruta.isEmpty) return const [];
  final ordenVendedores = <String>[];
  final grupos = <String, List<Pedido>>{};
  for (final p in ruta) {
    final clave = p.vendedorId ?? '__sin_vendedor__';
    if (!grupos.containsKey(clave)) {
      ordenVendedores.add(clave);
      grupos[clave] = <Pedido>[];
    }
    grupos[clave]!.add(p);
  }
  return ordenVendedores.map((k) => grupos[k]!).toList(growable: false);
}

double _gradosARadianes(double grados) => grados * math.pi / 180;