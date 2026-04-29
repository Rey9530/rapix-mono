import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  ActualizarReglaTarifaPayload,
  CrearReglaTarifaPayload,
  FiltrosReglaTarifa,
  ReglaTarifa,
} from "../modelos/regla-tarifa.modelo";
import { RespuestaPaginada } from "../modelos/respuesta-paginada.modelo";

@Injectable({ providedIn: "root" })
export class ReglasTarifaServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/reglas-tarifa`;

  listar(
    filtros: FiltrosReglaTarifa = {},
  ): Observable<RespuestaPaginada<ReglaTarifa>> {
    let params = new HttpParams();
    if (filtros.pagina !== undefined)
      params = params.set("pagina", filtros.pagina);
    if (filtros.limite !== undefined)
      params = params.set("limite", filtros.limite);
    if (filtros.modoFacturacion)
      params = params.set("modoFacturacion", filtros.modoFacturacion);
    if (filtros.activa !== undefined)
      params = params.set("activa", String(filtros.activa));
    if (filtros.busqueda) params = params.set("busqueda", filtros.busqueda);
    return this.http.get<RespuestaPaginada<ReglaTarifa>>(this.base, { params });
  }

  obtenerPorId(id: string): Observable<ReglaTarifa> {
    return this.http.get<ReglaTarifa>(`${this.base}/${id}`);
  }

  crear(payload: CrearReglaTarifaPayload): Observable<ReglaTarifa> {
    return this.http.post<ReglaTarifa>(this.base, payload);
  }

  actualizar(
    id: string,
    payload: ActualizarReglaTarifaPayload,
  ): Observable<ReglaTarifa> {
    return this.http.patch<ReglaTarifa>(`${this.base}/${id}`, payload);
  }

  desactivar(id: string): Observable<ReglaTarifa> {
    return this.http.patch<ReglaTarifa>(`${this.base}/${id}/desactivar`, {});
  }

  activar(id: string): Observable<ReglaTarifa> {
    return this.http.patch<ReglaTarifa>(`${this.base}/${id}/activar`, {});
  }
}
