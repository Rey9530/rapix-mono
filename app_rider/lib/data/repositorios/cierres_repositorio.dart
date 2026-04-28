import 'dart:io';
import 'package:dio/dio.dart';
import '../../core/network/excepciones_api.dart';
import '../modelos/cierre_financiero.dart';

class CierresRepositorio {
  final Dio _dio;

  CierresRepositorio({required Dio dio}) : _dio = dio;

  Future<ResumenCierreHoy> resumenHoy() async {
    final r = await _dio.get<Map<String, dynamic>>('/cierres-financieros/yo/hoy');
    return ResumenCierreHoy.fromJson(r.data!);
  }

  Future<CierreFinanciero> crear({
    required double montoReportado,
    required File comprobante,
    String? notas,
  }) async {
    final form = FormData();
    form.files.add(
      MapEntry(
        'comprobanteFoto',
        await MultipartFile.fromFile(comprobante.path, filename: 'comprobante.jpg'),
      ),
    );
    form.fields.add(MapEntry('montoReportado', montoReportado.toString()));
    if (notas != null && notas.isNotEmpty) {
      form.fields.add(MapEntry('notas', notas));
    }

    try {
      final r = await _dio.post<Map<String, dynamic>>(
        '/cierres-financieros',
        data: form,
        options: Options(contentType: 'multipart/form-data'),
      );
      return CierreFinanciero.fromJson(r.data!);
    } on DioException catch (e) {
      final data = e.response?.data;
      String mensaje = 'No se pudo enviar el cierre';
      String? codigo;
      if (data is Map<String, dynamic>) {
        final m = data['message'];
        if (m is String) mensaje = m;
        if (m is List && m.isNotEmpty) mensaje = m.first.toString();
        if (data['codigo'] is String) codigo = data['codigo'] as String;
      }
      throw ExcepcionApi(mensaje, codigoHttp: e.response?.statusCode, codigoNegocio: codigo);
    }
  }
}
