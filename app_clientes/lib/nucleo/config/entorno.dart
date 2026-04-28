/// Variables de entorno inyectadas via --dart-define.
class Entorno {
  Entorno._();

  /// URL base del backend NestJS. En emulador Android usar 10.0.2.2.
  static const String urlApi = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://ltks7gct-3000.use2.devtunnels.ms/api/v1',
  );

  /// Token publico de Mapbox.
  static const String tokenMapbox = String.fromEnvironment(
    'MAPBOX_TOKEN',
    defaultValue: '',
  );

  /// Centro inicial del mapa (San Salvador) cuando no hay GPS disponible.
  static const double latitudInicial = 13.6929;
  static const double longitudInicial = -89.2182;
}
