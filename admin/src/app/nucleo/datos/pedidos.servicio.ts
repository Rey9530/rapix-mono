import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { FiltrosPedido, Pedido, PedidoDetalle } from "../modelos/pedido.modelo";
import { RespuestaPaginada } from "../modelos/respuesta-paginada.modelo";

export interface AsignarManualPayload {
  repartidorRecogidaId?: string;
  repartidorEntregaId?: string;
}

export interface AsignarMultiplePayload {
  pedidoIds: string[];
  repartidorRecogidaId: string;
  repartidorEntregaId?: string;
}

export interface RespuestaAsignarMultiple {
  asignados: number;
  fallidos: Array<{ pedidoId: string; motivo: string }>;
}

@Injectable({ providedIn: "root" })
export class PedidosServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/pedidos`;

  listar(filtros: FiltrosPedido = {}): Observable<RespuestaPaginada<Pedido>> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<RespuestaPaginada<Pedido>>(this.base, { params });
  }

  obtenerPorId(id: string): Observable<PedidoDetalle> {
    return this.http.get<PedidoDetalle>(`${this.base}/${id}`);
  }

  asignarAutomatico(): Observable<{
    procesados: number;
    asignados: number;
    pendientes: number;
  }> {
    return this.http.post<{
      procesados: number;
      asignados: number;
      pendientes: number;
    }>(`${this.base}/asignar-automatico`, null);
  }

  asignarManual(id: string, payload: AsignarManualPayload): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.base}/${id}/asignar`, payload);
  }

  asignarMultiple(
    payload: AsignarMultiplePayload,
  ): Observable<RespuestaAsignarMultiple> {
    return this.http.post<RespuestaAsignarMultiple>(
      `${this.base}/asignar-multiple`,
      payload,
    );
  }

  cancelar(id: string, motivo: string): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.base}/${id}/cancelar`, { motivo });
  }
}
