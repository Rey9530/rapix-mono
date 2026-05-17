import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  CrearDepositoPayload,
  CuentaBancariaOpcion,
  DepositoVendedor,
  DepositoVendedorDetalle,
  FiltrosDepositosAdmin,
  SaldoPendienteVendedor,
  VendedorOpcion,
} from "../modelos/deposito.modelo";
import { RespuestaPaginada } from "../modelos/respuesta-paginada.modelo";

@Injectable({ providedIn: "root" })
export class DepositosServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/vendedores`;

  listarVendedores(): Observable<VendedorOpcion[]> {
    return this.http.get<VendedorOpcion[]>(this.base);
  }

  saldoPendienteDe(vendedorId: string): Observable<SaldoPendienteVendedor> {
    return this.http.get<SaldoPendienteVendedor>(
      `${this.base}/${vendedorId}/saldo-pendiente`,
    );
  }

  cuentasBancariasDe(
    vendedorId: string,
  ): Observable<CuentaBancariaOpcion[]> {
    return this.http.get<CuentaBancariaOpcion[]>(
      `${this.base}/${vendedorId}/cuentas-bancarias`,
    );
  }

  crear(payload: CrearDepositoPayload): Observable<DepositoVendedor> {
    const form = new FormData();
    form.append("vendedorId", payload.vendedorId);
    payload.pedidoIds.forEach((id) => form.append("pedidoIds", id));
    if (payload.cuentaBancariaId)
      form.append("cuentaBancariaId", payload.cuentaBancariaId);
    if (payload.fechaDeposito)
      form.append("fechaDeposito", payload.fechaDeposito);
    if (payload.referencia) form.append("referencia", payload.referencia);
    if (payload.notas) form.append("notas", payload.notas);
    form.append("comprobante", payload.comprobante);
    return this.http.post<DepositoVendedor>(`${this.base}/depositos`, form);
  }

  obtenerPorId(id: string): Observable<DepositoVendedorDetalle> {
    return this.http.get<DepositoVendedorDetalle>(
      `${this.base}/depositos/${id}`,
    );
  }

  listar(
    filtros: FiltrosDepositosAdmin = {},
  ): Observable<RespuestaPaginada<DepositoVendedor>> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "")
        params = params.set(k, String(v));
    });
    return this.http.get<RespuestaPaginada<DepositoVendedor>>(
      `${this.base}/depositos`,
      { params },
    );
  }
}
