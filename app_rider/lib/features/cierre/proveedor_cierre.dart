import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/proveedores_globales.dart';
import '../../data/modelos/cierre_financiero.dart';

final resumenCierreHoyProveedor = FutureProvider<ResumenCierreHoy>((ref) async {
  return ref.read(cierresRepositorioProveedor).resumenHoy();
});
