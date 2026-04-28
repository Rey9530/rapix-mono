class Entorno {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://10.0.2.2:3000/api/v1',
  );

  static const String tokenMapbox = String.fromEnvironment(
    'MAPBOX_TOKEN',
    defaultValue: '',
  );
}
