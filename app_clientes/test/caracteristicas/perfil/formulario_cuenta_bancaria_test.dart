import 'package:app_clientes/caracteristicas/perfil/cuentas_bancarias/cuentas_bancarias_controlador.dart';
import 'package:app_clientes/caracteristicas/perfil/cuentas_bancarias/formulario_cuenta_bancaria_pantalla.dart';
import 'package:app_clientes/datos/modelos/cuenta_bancaria.dart';
import 'package:app_clientes/datos/repositorios/cuentas_bancarias_repositorio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

class _RepoFalso implements CuentasBancariasRepositorio {
  _RepoFalso({this.cuentas = const []});

  final List<CuentaBancaria> cuentas;

  @override
  Future<List<Banco>> listarBancos() async => [
        Banco(id: 'b1', codigo: 'AGRICOLA', nombre: 'Banco Agrícola'),
        Banco(id: 'b2', codigo: 'CUSCATLAN', nombre: 'Banco Cuscatlán'),
      ];

  @override
  Future<List<CuentaBancaria>> listar() async => cuentas;

  @override
  Future<CuentaBancaria> crear(CrearCuentaBancariaEntrada entrada) async {
    throw UnimplementedError();
  }

  @override
  Future<CuentaBancaria> actualizar(
    String id,
    ActualizarCuentaBancariaEntrada entrada,
  ) async {
    throw UnimplementedError();
  }

  @override
  Future<void> eliminar(String id) async {}
}

Widget _envolver({
  _RepoFalso? repo,
  String? cuentaId,
}) {
  return ProviderScope(
    overrides: [
      cuentasBancariasRepositorioProvider.overrideWithValue(
        repo ?? _RepoFalso(),
      ),
    ],
    child: MaterialApp(
      home: FormularioCuentaBancariaPantalla(cuentaId: cuentaId),
    ),
  );
}

void main() {
  testWidgets('muestra error si el número de cuenta tiene menos de 8 dígitos',
      (tester) async {
    await tester.pumpWidget(_envolver());
    await tester.pumpAndSettle();

    final campoNumero = find.widgetWithText(TextFormField, '8 a 20 dígitos');
    expect(campoNumero, findsOneWidget);

    await tester.enterText(campoNumero, '123');
    await tester.tap(find.widgetWithText(FilledButton, 'Guardar'));
    await tester.pumpAndSettle();

    expect(find.text('Debe contener entre 8 y 20 dígitos'), findsOneWidget);
  });

  testWidgets('en modo edición banco y número están deshabilitados',
      (tester) async {
    final cuenta = CuentaBancaria(
      id: 'c1',
      banco: Banco(id: 'b1', codigo: 'AGRICOLA', nombre: 'Banco Agrícola'),
      tipoCuenta: TipoCuentaBancaria.ahorro,
      numeroCuenta: '12345678',
      esPrincipal: true,
      alias: 'Negocio',
    );
    await tester.pumpWidget(_envolver(
      repo: _RepoFalso(cuentas: [cuenta]),
      cuentaId: 'c1',
    ));
    await tester.pumpAndSettle();

    // El campo del número de cuenta debe estar deshabilitado.
    final textField = tester.widget<TextField>(
      find
          .descendant(
            of: find.byType(TextFormField),
            matching: find.byType(TextField),
          )
          .first,
    );
    expect(textField.enabled, isFalse);

    // El dropdown de banco también debe estar deshabilitado (onChanged == null).
    final dropdown = tester
        .widgetList<DropdownButtonFormField<String>>(
          find.byType(DropdownButtonFormField<String>),
        )
        .first;
    expect(dropdown.onChanged, isNull);
  });
}
