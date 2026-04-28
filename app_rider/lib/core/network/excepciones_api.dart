class ExcepcionApi implements Exception {
  final String mensaje;
  final int? codigoHttp;
  final String? codigoNegocio;

  const ExcepcionApi(
    this.mensaje, {
    this.codigoHttp,
    this.codigoNegocio,
  });

  @override
  String toString() => 'ExcepcionApi($codigoHttp/$codigoNegocio): $mensaje';
}

class ExcepcionRed extends ExcepcionApi {
  const ExcepcionRed(super.mensaje);
}

class ExcepcionAutenticacion extends ExcepcionApi {
  const ExcepcionAutenticacion(super.mensaje) : super(codigoHttp: 401);
}
