import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { CierreFinanciero, FiltrosCierre } from "../modelos/cierre.modelo";
import { RespuestaPaginada } from "../modelos/respuesta-paginada.modelo";

@Injectable({ providedIn: "root" })
export class CierresServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/cierres-financieros`;

  listar(
    filtros: FiltrosCierre = {},
  ): Observable<RespuestaPaginada<CierreFinanciero>> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<RespuestaPaginada<CierreFinanciero>>(this.base, {
      params,
    });
  }

  obtenerPorId(id: string): Observable<CierreFinanciero> {
    return this.http.get<CierreFinanciero>(`${this.base}/${id}`);
  }

  aprobar(id: string): Observable<CierreFinanciero> {
    return this.http.post<CierreFinanciero>(`${this.base}/${id}/aprobar`, null);
  }

  rechazar(id: string, motivo: string): Observable<CierreFinanciero> {
    return this.http.post<CierreFinanciero>(`${this.base}/${id}/rechazar`, {
      motivo,
    });
  }
}
