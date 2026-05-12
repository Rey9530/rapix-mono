import 'package:app_clientes/datos/modelos/cuenta_bancaria.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Banco.desdeJson', () {
    test('parsea los campos básicos', () {
      final b = Banco.desdeJson({
        'id': 'b1',
        'codigo': 'AGRICOLA',
        'nombre': 'Banco Agrícola',
      });
      expect(b.id, 'b1');
      expect(b.codigo, 'AGRICOLA');
      expect(b.nombre, 'Banco Agrícola');
    });
  });

  group('TipoCuentaBancaria', () {
    test('mapea de y hacia el valor API', () {
      expect(TipoCuentaBancaria.desdeApi('AHORRO'), TipoCuentaBancaria.ahorro);
      expect(
        TipoCuentaBancaria.desdeApi('CORRIENTE'),
        TipoCuentaBancaria.corriente,
      );
      expect(TipoCuentaBancaria.ahorro.apiValor, 'AHORRO');
      expect(TipoCuentaBancaria.corriente.apiValor, 'CORRIENTE');
    });

    test('lanza para valores desconocidos', () {
      expect(
        () => TipoCuentaBancaria.desdeApi('OTRO'),
        throwsA(isA<ArgumentError>()),
      );
    });
  });

  group('CuentaBancaria.desdeJson', () {
    test('parsea cuenta completa', () {
      final c = CuentaBancaria.desdeJson({
        'id': 'c1',
        'banco': {
          'id': 'b1',
          'codigo': 'AGRICOLA',
          'nombre': 'Banco Agrícola',
        },
        'tipoCuenta': 'AHORRO',
        'numeroCuenta': '12345678',
        'alias': 'Mi cuenta',
        'esPrincipal': true,
      });
      expect(c.id, 'c1');
      expect(c.banco.codigo, 'AGRICOLA');
      expect(c.tipoCuenta, TipoCuentaBancaria.ahorro);
      expect(c.numeroCuenta, '12345678');
      expect(c.alias, 'Mi cuenta');
      expect(c.esPrincipal, true);
    });

    test('esPrincipal=false por defecto si falta', () {
      final c = CuentaBancaria.desdeJson({
        'id': 'c1',
        'banco': {
          'id': 'b1',
          'codigo': 'AGRICOLA',
          'nombre': 'Banco Agrícola',
        },
        'tipoCuenta': 'CORRIENTE',
        'numeroCuenta': '99887766',
      });
      expect(c.esPrincipal, false);
      expect(c.alias, isNull);
    });
  });

  group('CuentaBancaria.numeroEnmascarado', () {
    Banco banco() => Banco(id: 'b', codigo: 'X', nombre: 'X');

    test('muestra solo los últimos 4 dígitos', () {
      final c = CuentaBancaria(
        id: 'a',
        banco: banco(),
        tipoCuenta: TipoCuentaBancaria.ahorro,
        numeroCuenta: '1234567890',
        esPrincipal: false,
      );
      expect(c.numeroEnmascarado, '****7890');
    });

    test('para números muy cortos devuelve solo asteriscos', () {
      final c = CuentaBancaria(
        id: 'a',
        banco: banco(),
        tipoCuenta: TipoCuentaBancaria.ahorro,
        numeroCuenta: '12',
        esPrincipal: false,
      );
      expect(c.numeroEnmascarado, '**');
    });
  });
}
