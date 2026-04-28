class Entorno {
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://ltks7gct-3000.use2.devtunnels.ms/api/v1',
  );

  static const String tokenMapbox = String.fromEnvironment(
    'MAPBOX_TOKEN',
    defaultValue: '',
  );
}
