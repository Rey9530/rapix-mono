import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  ActualizarVersionAppPayload,
  AplicacionMovil,
  VersionApp,
} from "../modelos/configuracion.modelo";

@Injectable({ providedIn: "root" })
export class ConfiguracionServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/configuracion`;

  obtenerVersionApp(aplicacion: AplicacionMovil): Observable<VersionApp> {
    return this.http.get<VersionApp>(`${this.base}/version-app/${aplicacion}`);
  }

  actualizarVersionApp(
    aplicacion: AplicacionMovil,
    payload: ActualizarVersionAppPayload,
  ): Observable<VersionApp> {
    return this.http.patch<VersionApp>(
      `${this.base}/version-app/${aplicacion}`,
      payload,
    );
  }
}
