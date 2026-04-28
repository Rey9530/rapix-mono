import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  ActualizarZonaPayload,
  AsignarRepartidoresPayload,
  CrearZonaPayload,
  RespuestaAsignacionRepartidores,
  Zona,
} from "../modelos/zona.modelo";

export type { Zona } from "../modelos/zona.modelo";

@Injectable({ providedIn: "root" })
export class ZonasServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/zonas`;

  listar(incluirInactivas = false): Observable<Zona[]> {
    let params = new HttpParams();
    if (incluirInactivas) params = params.set("incluirInactivas", "true");
    return this.http.get<Zona[]>(this.base, { params });
  }

  obtenerPorId(id: string): Observable<Zona> {
    return this.http.get<Zona>(`${this.base}/${id}`);
  }

  crear(payload: CrearZonaPayload): Observable<Zona> {
    return this.http.post<Zona>(this.base, payload);
  }

  actualizar(id: string, payload: ActualizarZonaPayload): Observable<Zona> {
    return this.http.patch<Zona>(`${this.base}/${id}`, payload);
  }

  eliminar(id: string): Observable<Zona> {
    return this.http.delete<Zona>(`${this.base}/${id}`);
  }

  asignarRepartidores(
    id: string,
    payload: AsignarRepartidoresPayload,
  ): Observable<RespuestaAsignacionRepartidores> {
    return this.http.post<RespuestaAsignacionRepartidores>(
      `${this.base}/${id}/repartidores`,
      payload,
    );
  }
}
