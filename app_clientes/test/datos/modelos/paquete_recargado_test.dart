import 'package:app_clientes/datos/modelos/paquete_recargado.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ReglaTarifaPaquete.desdeJson', () {
    test('parsea con num', () {
      final json = {
        'id': 'r1',
        'nombre': 'Paquete Basico',
        'tamanoPaquete': 10,
        'precioPaquete': 50.0,
        'descripcion': 'Diez envios',
        'diasValidez': 30,
      };

      final r = ReglaTarifaPaquete.desdeJson(json);

      expect(r.tamanoPaquete, 10);
      expect(r.precioPaquete, 50.0);
      expect(r.diasValidez, 30);
    });

    test('parsea con Decimal de Prisma como String', () {
      final json = {
        'id': 'r2',
        'nombre': 'Paquete Premium',
        'tamanoPaquete': '25',
        'precioPaquete': '125.75',
        'diasValidez': '60',
      };

      final r = ReglaTarifaPaquete.desdeJson(json);

      expect(r.tamanoPaquete, 25);
      expect(r.precioPaquete, 125.75);
      expect(r.diasValidez, 60);
    });

    test('campos nulos respetan defaults', () {
      final json = {
        'id': 'r3',
        'nombre': 'Sin precio',
        'tamanoPaquete': null,
        'precioPaquete': null,
        'diasValidez': null,
      };

      final r = ReglaTarifaPaquete.desdeJson(json);

      expect(r.tamanoPaquete, 0);
      expect(r.precioPaquete, 0.0);
      expect(r.diasValidez, isNull);
    });
  });

  group('PaqueteRecargado.desdeJson', () {
    test('parsea con num', () {
      final json = {
        'id': 'p1',
        'nombre': 'Paquete 10',
        'estado': 'ACTIVO',
        'enviosTotales': 10,
        'enviosRestantes': 7,
        'precio': 50.0,
        'compradoEn': '2026-04-27T12:00:00Z',
      };

      final p = PaqueteRecargado.desdeJson(json);

      expect(p.enviosTotales, 10);
      expect(p.enviosRestantes, 7);
      expect(p.enviosUsados, 3);
      expect(p.precio, 50.0);
      expect(p.nombre, 'Paquete 10');
    });

    test('parsea con Decimal/BigInt como String', () {
      final json = {
        'id': 'p2',
        'nombre': 'Paquete 10',
        'estado': 'ACTIVO',
        'enviosTotales': '10',
        'enviosRestantes': '7',
        'precio': '50.00',
        'compradoEn': '2026-04-27T12:00:00Z',
      };

      final p = PaqueteRecargado.desdeJson(json);

      expect(p.enviosTotales, 10);
      expect(p.enviosRestantes, 7);
      expect(p.enviosUsados, 3);
      expect(p.precio, 50.0);
    });
  });

  group('SaldoPaquetes.desdeJson', () {
    test('lee saldoRecargado como String', () {
      final json = {
        'saldoRecargado': '15',
        'paquetesActivos': '2',
      };

      final s = SaldoPaquetes.desdeJson(json);

      expect(s.saldoRecargado, 15);
      expect(s.paquetesActivos, 2);
    });

    test('cae a enviosRestantes cuando saldoRecargado es null', () {
      final json = {
        'saldoRecargado': null,
        'enviosRestantes': '7',
        'paquetesActivos': 1,
      };

      final s = SaldoPaquetes.desdeJson(json);

      expect(s.saldoRecargado, 7);
    });
  });
}
