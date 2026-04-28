import 'package:dio/dio.dart';

class TokensDispositivoRepositorio {
  final Dio _dio;

  TokensDispositivoRepositorio({required Dio dio}) : _dio = dio;

  Future<void> registrar({required String token, required String plataforma}) async {
    await _dio.post<void>(
      '/tokens-dispositivo',
      data: {'token': token, 'plataforma': plataforma},
    );
  }

  Future<void> eliminar(String token) async {
    await _dio.delete<void>('/tokens-dispositivo/$token');
  }
}
