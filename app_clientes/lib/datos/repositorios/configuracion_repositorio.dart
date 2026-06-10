import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';

import '../../nucleo/red/dio_cliente.dart';

class ConfiguracionRepositorio {
  ConfiguracionRepositorio(this._dio);

  final Dio _dio;

  /// Versión mínima requerida de la app según el backend (endpoint público).
  Future<String> obtenerVersionMinima() async {
    final respuesta = await _dio.get<Map<String, dynamic>>(
      '/configuracion/version-app/CLIENTES',
    );
    return respuesta.data!['versionMinima'] as String;
  }
}

final configuracionRepositorioProvider = Provider<ConfiguracionRepositorio>((
  ref,
) {
  return ConfiguracionRepositorio(ref.watch(dioClienteProvider));
});

/// true si la versión instalada es menor que la mínima requerida por el
/// backend. Fail-open: ante cualquier error (red, timeout, parsing) devuelve
/// false — un fallo del endpoint nunca debe dejar la app bloqueada.
final actualizacionRequeridaProvider = FutureProvider<bool>((ref) async {
  try {
    final repo = ref.watch(configuracionRepositorioProvider);
    final minima = await repo
        .obtenerVersionMinima()
        .timeout(const Duration(seconds: 8));
    final info = await PackageInfo.fromPlatform();
    return _esVersionMenor(info.version, minima);
  } catch (_) {
    return false;
  }
});

/// Compara versiones semver simples (x.y.z) componente a componente.
bool _esVersionMenor(String actual, String minima) {
  List<int> partes(String v) =>
      v.split('.').map((p) => int.tryParse(p.trim()) ?? 0).toList();
  final a = partes(actual);
  final m = partes(minima);
  for (var i = 0; i < 3; i++) {
    final va = i < a.length ? a[i] : 0;
    final vm = i < m.length ? m[i] : 0;
    if (va != vm) return va < vm;
  }
  return false;
}
