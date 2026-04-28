import 'package:app_clientes/nucleo/util/parseo_json.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('parseDoubleSeguro', () {
    test('acepta int', () {
      expect(parseDoubleSeguro(15), 15.0);
    });

    test('acepta double', () {
      expect(parseDoubleSeguro(15.5), 15.5);
    });

    test('acepta String numerico (caso bug Prisma Decimal)', () {
      expect(parseDoubleSeguro('15.50'), 15.5);
    });

    test('acepta String entero', () {
      expect(parseDoubleSeguro('15'), 15.0);
    });

    test('hace trim al String', () {
      expect(parseDoubleSeguro(' 15.5 '), 15.5);
    });

    test('null retorna null', () {
      expect(parseDoubleSeguro(null), isNull);
    });

    test('String invalido retorna null sin lanzar', () {
      expect(parseDoubleSeguro('abc'), isNull);
    });

    test('Map retorna null sin lanzar', () {
      expect(parseDoubleSeguro({'a': 1}), isNull);
    });

    test('List retorna null sin lanzar', () {
      expect(parseDoubleSeguro([1, 2]), isNull);
    });
  });

  group('parseDoubleSeguroODefault', () {
    test('null usa el default', () {
      expect(parseDoubleSeguroODefault(null), 0.0);
    });

    test('default custom', () {
      expect(parseDoubleSeguroODefault(null, porDefecto: 7.5), 7.5);
    });

    test('valor presente ignora el default', () {
      expect(parseDoubleSeguroODefault('15.50', porDefecto: 99), 15.5);
    });

    test('String invalido cae al default', () {
      expect(parseDoubleSeguroODefault('xyz', porDefecto: 1), 1.0);
    });
  });

  group('parseIntSeguro', () {
    test('acepta int', () {
      expect(parseIntSeguro(7), 7);
    });

    test('acepta double y trunca', () {
      expect(parseIntSeguro(7.9), 7);
    });

    test('acepta String entero', () {
      expect(parseIntSeguro('42'), 42);
    });

    test('acepta String decimal y trunca', () {
      expect(parseIntSeguro('15.5'), 15);
    });

    test('hace trim al String', () {
      expect(parseIntSeguro(' 42 '), 42);
    });

    test('null retorna null', () {
      expect(parseIntSeguro(null), isNull);
    });

    test('String invalido retorna null sin lanzar', () {
      expect(parseIntSeguro('abc'), isNull);
    });
  });

  group('parseIntSeguroODefault', () {
    test('null usa el default', () {
      expect(parseIntSeguroODefault(null), 0);
    });

    test('default custom', () {
      expect(parseIntSeguroODefault(null, porDefecto: 5), 5);
    });

    test('valor presente ignora el default', () {
      expect(parseIntSeguroODefault('42', porDefecto: 99), 42);
    });
  });
}
