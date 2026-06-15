import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import mapboxgl from "mapbox-gl";

import { environment } from "../../../environments/environment";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import {
  CoberturaVendedores,
  VendedorEnCobertura,
} from "../../nucleo/modelos/zona.modelo";
import type { EstadoUsuario } from "../../nucleo/modelos/usuario.modelo";

const ESTILO_MAPA = "mapbox://styles/mapbox/streets-v12";
const ID_FUENTE_ZONA = "fuente-zona-cobertura";
const ID_CAPA_RELLENO = "capa-relleno-zona-cobertura";
const ID_CAPA_BORDE = "capa-borde-zona-cobertura";

type FiltroEstado = "TODOS" | EstadoUsuario;

@Component({
  selector: "app-zona-cobertura-vendedores-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./zona-cobertura-vendedores.modal.html",
  styleUrl: "./zona-cobertura-vendedores.modal.scss",
})
export class ZonaCoberturaVendedoresModal
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("contenedor")
  contenedor?: ElementRef<HTMLDivElement>;

  @Input() zonaId!: string;

  readonly modal = inject(NgbActiveModal);
  private readonly servicio = inject(ZonasServicio);

  readonly tokenAusente = !environment.tokenMapboxPublico;

  readonly cargando = signal(true);
  readonly cobertura = signal<CoberturaVendedores | null>(null);
  readonly error = signal<string | null>(null);
  readonly filtroEstado = signal<FiltroEstado>("TODOS");

  readonly vendedoresFiltrados = computed<VendedorEnCobertura[]>(() => {
    const c = this.cobertura();
    if (!c) return [];
    const filtro = this.filtroEstado();
    if (filtro === "TODOS") return c.vendedores;
    return c.vendedores.filter((v) => v.estado === filtro);
  });

  readonly countDentro = computed(
    () => this.vendedoresFiltrados().filter((v) => v.dentroDeZona).length,
  );

  readonly countFuera = computed(
    () => this.vendedoresFiltrados().filter((v) => !v.dentroDeZona).length,
  );

  readonly filtrosDisponibles: FiltroEstado[] = [
    "TODOS",
    "ACTIVO",
    "INACTIVO",
    "SUSPENDIDO",
    "PENDIENTE_VERIFICACION",
  ];

  private mapa?: mapboxgl.Map;
  private mapaListo = false;
  private marcadores: Map<string, mapboxgl.Marker> = new Map();
  private marcadorPuntoIntercambio?: mapboxgl.Marker;
  private poligonoDibujado = false;
  private vendedorPopup: mapboxgl.Popup | null = null;

  ngOnInit(): void {
    this.servicio.coberturaVendedores(this.zonaId).subscribe({
      next: (c) => {
        this.cobertura.set(c);
        this.cargando.set(false);
        // Si el mapa ya cargó, dibujamos ahora.
        if (this.mapaListo) this.dibujarTodo();
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(e?.error?.mensaje ?? "No se pudo cargar la cobertura.");
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.tokenAusente || !this.contenedor) return;
    mapboxgl.accessToken = environment.tokenMapboxPublico;

    // Inicializamos con centro en San Salvador; al cargar la zona se ajusta.
    this.mapa = new mapboxgl.Map({
      container: this.contenedor.nativeElement,
      style: ESTILO_MAPA,
      center: [-89.2182, 13.6929],
      zoom: 11,
    });

    this.mapa.addControl(new mapboxgl.NavigationControl(), "top-right");
    this.mapa.on("load", () => {
      this.mapaListo = true;
      if (this.cobertura()) this.dibujarTodo();
    });
  }

  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = undefined;
    }
  }

  // ============================================================
  // Render
  // ============================================================

  private dibujarTodo(): void {
    if (!this.mapa || !this.mapaListo) return;
    const c = this.cobertura();
    if (!c) return;

    this.dibujarPoligono(c.zona);
    this.dibujarPuntoIntercambio(c);
    this.dibujarMarcadores();
    this.ajustarVista();
  }

  private dibujarPoligono(zona: { poligono?: { lat: number; lng: number }[] }): void {
    if (!this.mapa) return;
    this.limpiarPoligono();

    const puntos = zona.poligono ?? [];
    if (puntos.length < 3) {
      this.poligonoDibujado = false;
      return;
    }

    const anillo = puntos.map((p) => [p.lng, p.lat]);
    anillo.push([anillo[0][0], anillo[0][1]]);

    this.mapa.addSource(ID_FUENTE_ZONA, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [anillo] },
      },
    });
    this.mapa.addLayer({
      id: ID_CAPA_RELLENO,
      type: "fill",
      source: ID_FUENTE_ZONA,
      paint: { "fill-color": "#0d6efd", "fill-opacity": 0.15 },
    });
    this.mapa.addLayer({
      id: ID_CAPA_BORDE,
      type: "line",
      source: ID_FUENTE_ZONA,
      paint: { "line-color": "#0d6efd", "line-width": 2 },
    });
    this.poligonoDibujado = true;
  }

  private dibujarPuntoIntercambio(c: CoberturaVendedores): void {
    if (!this.mapa) return;
    this.marcadorPuntoIntercambio?.remove();
    this.marcadorPuntoIntercambio = undefined;

    const p = c.puntoIntercambio;
    if (!p) return;

    const el = document.createElement("div");
    el.className = "marcador-punto-intercambio";
    el.title = `Punto de intercambio: ${p.nombre}`;
    el.textContent = "I";

    this.marcadorPuntoIntercambio = new mapboxgl.Marker({ element: el })
      .setLngLat([p.longitud, p.latitud])
      .setPopup(
        new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
          `<strong>${escapeHtml(p.nombre)}</strong><br/><small>Punto de intercambio</small>`,
        ),
      )
      .addTo(this.mapa);
  }

  private dibujarMarcadores(): void {
    if (!this.mapa) return;
    this.limpiarMarcadores();
    for (const v of this.vendedoresFiltrados()) {
      this.crearMarcador(v);
    }
  }

  private crearMarcador(v: VendedorEnCobertura): void {
    if (!this.mapa) return;
    const el = document.createElement("div");
    el.className = "marcador-vendedor";
    if (!v.dentroDeZona) el.classList.add("fuera");
    el.style.setProperty("--color-estado", this.colorEstado(v.estado));
    el.title = `${v.nombreNegocio} — ${v.nombreCompleto}`;

    const popup = new mapboxgl.Popup({ offset: 18, closeButton: true }).setHTML(
      this.htmlPopup(v),
    );
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
    });

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([v.longitud, v.latitud])
      .setPopup(popup)
      .addTo(this.mapa);

    this.marcadores.set(v.usuarioId, marker);
  }

  private ajustarVista(): void {
    if (!this.mapa) return;
    const c = this.cobertura();
    if (!c) return;

    const poligono = c.zona.poligono ?? [];
    const marcadores = this.vendedoresFiltrados();
    if (poligono.length === 0 && marcadores.length === 0) {
      // Sin polígono ni vendedores: centramos en las coordenadas de la zona.
      this.mapa.flyTo({
        center: [c.zona.longitudCentro, c.zona.latitudCentro],
        zoom: 13,
        duration: 0,
      });
      return;
    }

    const primer: [number, number] =
      poligono.length > 0
        ? [poligono[0].lng, poligono[0].lat]
        : [marcadores[0].longitud, marcadores[0].latitud];

    const bounds = new mapboxgl.LngLatBounds(primer, primer);
    for (const p of poligono) bounds.extend([p.lng, p.lat]);
    for (const m of marcadores) bounds.extend([m.longitud, m.latitud]);
    if (c.puntoIntercambio) {
      bounds.extend([c.puntoIntercambio.longitud, c.puntoIntercambio.latitud]);
    }

    this.mapa.fitBounds(bounds, { padding: 50, duration: 0, maxZoom: 15 });
  }

  private limpiarPoligono(): void {
    if (!this.mapa || !this.mapaListo) return;
    if (this.mapa.getLayer(ID_CAPA_BORDE)) this.mapa.removeLayer(ID_CAPA_BORDE);
    if (this.mapa.getLayer(ID_CAPA_RELLENO))
      this.mapa.removeLayer(ID_CAPA_RELLENO);
    if (this.mapa.getSource(ID_FUENTE_ZONA))
      this.mapa.removeSource(ID_FUENTE_ZONA);
    this.poligonoDibujado = false;
  }

  private limpiarMarcadores(): void {
    this.marcadores.forEach((m) => m.remove());
    this.marcadores.clear();
  }

  // ============================================================
  // Acciones de UI
  // ============================================================

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtroEstado.set(filtro);
    if (this.mapaListo) {
      this.dibujarMarcadores();
      this.ajustarVista();
    }
  }

  centrarEnVendedor(v: VendedorEnCobertura): void {
    if (!this.mapa) return;
    this.mapa.flyTo({
      center: [v.longitud, v.latitud],
      zoom: 15,
      duration: 600,
    });
    const marcador = this.marcadores.get(v.usuarioId);
    const popup = marcador?.getPopup();
    if (marcador && popup) {
      // Cierra cualquier popup abierto y abre el del marcador.
      this.vendedorPopup?.remove();
      this.vendedorPopup = popup;
      popup.addTo(this.mapa);
    }
  }

  badgeEstadoClass(estado: EstadoUsuario): string {
    switch (estado) {
      case "ACTIVO":
        return "bg-success";
      case "SUSPENDIDO":
        return "bg-danger";
      case "INACTIVO":
        return "bg-secondary";
      case "PENDIENTE_VERIFICACION":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  }

  colorEstado(estado: EstadoUsuario): string {
    switch (estado) {
      case "ACTIVO":
        return "#198754";
      case "SUSPENDIDO":
        return "#dc3545";
      case "INACTIVO":
        return "#6c757d";
      case "PENDIENTE_VERIFICACION":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  }

  formatearDistancia(metros: number): string {
    if (metros < 1000) return `${Math.round(metros)} m`;
    return `${(metros / 1000).toFixed(1)} km`;
  }

  tienePoligono(zona?: { poligono?: { lat: number; lng: number }[] } | null): boolean {
    return !!zona && !!zona.poligono && zona.poligono.length >= 3;
  }

  cerrar(): void {
    this.modal.dismiss();
  }

  // ============================================================
  // Helpers
  // ============================================================

  private htmlPopup(v: VendedorEnCobertura): string {
    const estadoBadge = `<span class="badge ${this.badgeEstadoClass(v.estado)}">${v.estado}</span>`;
    const dentroBadge = v.dentroDeZona
      ? '<span class="badge bg-success ms-1">Dentro</span>'
      : '<span class="badge bg-danger ms-1">Fuera</span>';
    return `
      <div style="min-width:200px">
        <div class="fw-semibold">${escapeHtml(v.nombreNegocio)}</div>
        <div class="small text-muted">${escapeHtml(v.nombreCompleto)}</div>
        <div class="small mt-1">${escapeHtml(v.direccion)}</div>
        <div class="small mt-1">${estadoBadge}${dentroBadge}</div>
        <div class="small text-muted mt-1">${this.formatearDistancia(v.distanciaAlCentroMetros)} al centro</div>
      </div>
    `;
  }
}

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
