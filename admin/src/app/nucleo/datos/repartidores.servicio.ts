import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { PerfilRepartidor } from "../modelos/repartidor.modelo";

@Injectable({ providedIn: "root" })
export class RepartidoresServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/repartidores`;

  listar(): Observable<PerfilRepartidor[]> {
    return this.http.get<PerfilRepartidor[]>(this.base);
  }
}
