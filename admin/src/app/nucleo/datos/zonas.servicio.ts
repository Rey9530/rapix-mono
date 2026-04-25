import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";

export interface Zona {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activa: boolean;
  latitudCentro: number;
  longitudCentro: number;
}

@Injectable({ providedIn: "root" })
export class ZonasServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/zonas`;

  listar(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.base);
  }
}
