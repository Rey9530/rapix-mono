import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  ActualizarPaqueteAsignadoPayload,
  AsignarPaquetePayload,
  PaqueteRecargado,
} from "../modelos/paquete-recargado.modelo";
import { RespuestaPaginada } from "../modelos/respuesta-paginada.modelo";
import {
  EstadoUsuario,
  RolUsuario,
  Usuario,
  UsuarioDetalle,
} from "../modelos/usuario.modelo";

export interface FiltrosUsuario {
  pagina?: number;
  limite?: number;
  rol?: RolUsuario;
  estado?: EstadoUsuario;
  busqueda?: string;
}

export interface CrearUsuarioPayload {
  email: string;
  telefono: string;
  contrasena: string;
  nombreCompleto: string;
  rol: RolUsuario;
  // VENDEDOR
  nombreNegocio?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  // REPARTIDOR
  tipoVehiculo?: string;
  documentoIdentidad?: string;
  placa?: string;
  zonaIds?: string[];
  zonaPrimariaId?: string;
}

@Injectable({ providedIn: "root" })
export class UsuariosServicio {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.urlApi}/usuarios`;

  listar(filtros: FiltrosUsuario = {}): Observable<RespuestaPaginada<Usuario>> {
    let params = new HttpParams();
    if (filtros.pagina !== undefined)
      params = params.set("pagina", filtros.pagina);
    if (filtros.limite !== undefined)
      params = params.set("limite", filtros.limite);
    if (filtros.rol) params = params.set("rol", filtros.rol);
    if (filtros.estado) params = params.set("estado", filtros.estado);
    if (filtros.busqueda) params = params.set("busqueda", filtros.busqueda);
    return this.http.get<RespuestaPaginada<Usuario>>(this.base, { params });
  }

  obtenerPorId(id: string): Observable<UsuarioDetalle> {
    return this.http.get<UsuarioDetalle>(`${this.base}/${id}`);
  }

  crear(payload: CrearUsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, payload);
  }

  actualizar(
    id: string,
    payload: Partial<CrearUsuarioPayload>,
  ): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.base}/${id}`, payload);
  }

  cambiarEstado(
    id: string,
    estado: EstadoUsuario,
    motivo?: string,
  ): Observable<Usuario> {
    const cuerpo: { estado: EstadoUsuario; motivo?: string } = { estado };
    const motivoLimpio = motivo?.trim();
    if (motivoLimpio) cuerpo.motivo = motivoLimpio;
    return this.http.patch<Usuario>(`${this.base}/${id}/estado`, cuerpo);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  listarPaquetesAsignados(
    usuarioId: string,
    pagina = 1,
    limite = 50,
  ): Observable<RespuestaPaginada<PaqueteRecargado>> {
    const params = new HttpParams()
      .set("pagina", pagina)
      .set("limite", limite);
    return this.http.get<RespuestaPaginada<PaqueteRecargado>>(
      `${this.base}/${usuarioId}/paquetes`,
      { params },
    );
  }

  asignarPaquete(
    usuarioId: string,
    payload: AsignarPaquetePayload,
  ): Observable<PaqueteRecargado> {
    return this.http.post<PaqueteRecargado>(
      `${this.base}/${usuarioId}/paquetes`,
      payload,
    );
  }

  actualizarPaqueteAsignado(
    usuarioId: string,
    paqueteId: string,
    payload: ActualizarPaqueteAsignadoPayload,
  ): Observable<PaqueteRecargado> {
    return this.http.patch<PaqueteRecargado>(
      `${this.base}/${usuarioId}/paquetes/${paqueteId}`,
      payload,
    );
  }
}
