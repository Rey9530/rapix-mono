import 'package:app_clientes/datos/modelos/pedido.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Pedido.desdeJson', () {
    test('parsea JSON con campos numericos como num', () {
      final json = {
        'id': 'p1',
        'codigoSeguimiento': 'COD-1',
        'estado': 'PENDIENTE',
        'nombreCliente': 'Cliente',
        'telefonoCliente': '12345678',
        'direccionOrigen': 'Origen 1',
        'latitudOrigen': 13.6929,
        'longitudOrigen': -89.2182,
        'direccionDestino': 'Destino 1',
        'latitudDestino': 14.0,
        'longitudDestino': -90.0,
        'metodoPago': 'CONTRA_ENTREGA',
        'creadoEn': '2026-04-27T12:00:00Z',
        'montoContraEntrega': 25.50,
        'tarifaTotal': 5.00,
      };

      final p = Pedido.desdeJson(json);

      expect(p.id, 'p1');
      expect(p.latitudOrigen, 13.6929);
      expect(p.montoContraEntrega, 25.50);
      expect(p.tarifaTotal, 5.00);
    });

    test('parsea JSON con Decimal de Prisma como String (caso del bug)', () {
      final json = {
        'id': 'p2',
        'estado': 'PENDIENTE',
        'latitudOrigen': '13.6929',
        'longitudOrigen': '-89.2182',
        'latitudDestino': '14.0',
        'longitudDestino': '-90.0',
        'creadoEn': '2026-04-27T12:00:00Z',
        'montoContraEntrega': '25.50',
        'tarifaTotal': '5.00',
      };

      final p = Pedido.desdeJson(json);

      expect(p.latitudOrigen, 13.6929);
      expect(p.longitudOrigen, -89.2182);
      expect(p.montoContraEntrega, 25.50);
      expect(p.tarifaTotal, 5.00);
    });

    test('cae a costoEnvio cuando tarifaTotal no esta presente', () {
      final json = {
        'id': 'p3',
        'estado': 'PENDIENTE',
        'latitudOrigen': 0,
        'longitudOrigen': 0,
        'latitudDestino': 0,
        'longitudDestino': 0,
        'creadoEn': '2026-04-27T12:00:00Z',
        'costoEnvio': '7.25',
      };

      final p = Pedido.desdeJson(json);

      expect(p.tarifaTotal, 7.25);
    });

    test('campos opcionales nulos no lanzan', () {
      final json = {
        'id': 'p4',
        'estado': 'PENDIENTE',
        'latitudOrigen': null,
        'longitudOrigen': null,
        'latitudDestino': null,
        'longitudDestino': null,
        'creadoEn': '2026-04-27T12:00:00Z',
        'montoContraEntrega': null,
        'tarifaTotal': null,
      };

      final p = Pedido.desdeJson(json);

      expect(p.latitudOrigen, 0);
      expect(p.longitudOrigen, 0);
      expect(p.montoContraEntrega, isNull);
      expect(p.tarifaTotal, isNull);
    });
  });

  group('RepartidorAsignado.desdeJson', () {
    test('parsea ubicacion con coordenadas como String', () {
      final json = {
        'id': 'r1',
        'nombreCompleto': 'Repartidor Uno',
        'telefono': '99999999',
        'ubicacionActual': {
          'latitud': '13.7',
          'longitud': '-89.2',
        },
      };

      final r = RepartidorAsignado.desdeJson(json);

      expect(r.id, 'r1');
      expect(r.latitud, 13.7);
      expect(r.longitud, -89.2);
    });

    test('sin ubicacionActual deja coordenadas null', () {
      final json = {
        'id': 'r2',
        'nombreCompleto': 'Repartidor Dos',
      };

      final r = RepartidorAsignado.desdeJson(json);

      expect(r.latitud, isNull);
      expect(r.longitud, isNull);
    });
  });
}
