import 'package:app_clientes/datos/modelos/usuario.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('PerfilVendedor.desdeJson', () {
    test('parsea coordenadas como num', () {
      final json = {
        'nombreNegocio': 'Mi Negocio',
        'direccion': 'Calle 1',
        'latitud': 13.6929,
        'longitud': -89.2182,
      };

      final p = PerfilVendedor.desdeJson(json);

      expect(p.nombreNegocio, 'Mi Negocio');
      expect(p.latitud, 13.6929);
      expect(p.longitud, -89.2182);
    });

    test('parsea coordenadas como String', () {
      final json = {
        'latitud': '13.6929',
        'longitud': '-89.2182',
      };

      final p = PerfilVendedor.desdeJson(json);

      expect(p.latitud, 13.6929);
      expect(p.longitud, -89.2182);
    });

    test('coordenadas nulas no lanzan', () {
      final json = <String, dynamic>{
        'nombreNegocio': 'Negocio sin geo',
      };

      final p = PerfilVendedor.desdeJson(json);

      expect(p.latitud, isNull);
      expect(p.longitud, isNull);
    });
  });

  group('Usuario.desdeJson', () {
    test('parsea usuario con perfilVendedor anidado con coordenadas String',
        () {
      final json = {
        'id': 'u1',
        'email': 'a@b.com',
        'telefono': '12345678',
        'nombreCompleto': 'Test User',
        'rol': 'VENDEDOR',
        'perfilVendedor': {
          'nombreNegocio': 'Negocio',
          'latitud': '13.5',
          'longitud': '-89.0',
        },
      };

      final u = Usuario.desdeJson(json);

      expect(u.id, 'u1');
      expect(u.perfilVendedor?.latitud, 13.5);
      expect(u.perfilVendedor?.longitud, -89.0);
    });
  });
}
