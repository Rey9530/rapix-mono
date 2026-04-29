import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import mapboxgl from "mapbox-gl";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs";

import { environment } from "../../../environments/environment";
import { PedidosServicio } from "../../nucleo/datos/pedidos.servicio";
import { ZonasServicio } from "../../nucleo/datos/zonas.servicio";
import { Pedido } from "../../nucleo/modelos/pedido.modelo";
import { RepartidorDeZona } from "../../nucleo/modelos/repartidor.modelo";
import { Zona } from "../../nucleo/modelos/zona.modelo";

const ESTILO_MAPA = "mapbox://styles/mapbox/streets-v12";
const ID_FUENTE_ZONA = "fuente-zona-asignacion";
const ID_CAPA_RELLENO = "capa-relleno-zona-asignacion";
const ID_CAPA_BORDE = "capa-borde-zona-asignacion";

@Component({
  selector: "app-asignar-retiros-zona-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./asignar-retiros-zona.modal.html",
  styleUrl: "./asignar-retiros-zona.modal.scss",
})
export class AsignarRetirosZonaModal
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("contenedor")
  contenedor?: ElementRef<HTMLDivElement>;

  readonly modal = inject(NgbActiveModal);
  private readonly zonasServicio = inject(ZonasServicio);
  private readonly pedidosServicio = inject(PedidosServicio);
  private readonly toast = inject(ToastrService);

  readonly tokenAusente = !environment.tokenMapboxPublico;

  readonly zonas = signal<Zona[]>([]);
  readonly zonaSeleccionada = signal<Zona | null>(null);
  readonly pedidos = signal<Pedido[]>([]);
  readonly repartidores = signal<RepartidorDeZona[]>([]);
  readonly seleccionados = signal<Set<string>>(new Set<string>());
  readonly repartidorElegidoId = signal<string | null>(null);
  readonly cargandoZonas = signal(true);
  readonly cargandoZona = signal(false);
  readonly enviando = signal(false);

  zonaSeleccionadaId = "";

  asignacionRealizada = false;

  private mapa?: mapboxgl.Map;
  private mapaListo = false;
  private marcadores: Map<string, mapboxgl.Marker> = new Map();

  ngOnInit(): void {
    this.zonasServicio.listar().subscribe({
      next: (zs) => {
        this.zonas.set(zs);
        this.cargandoZonas.set(false);
      },
      error: () => {
        this.zonas.set([]);
        this.cargandoZonas.set(false);
        this.toast.error("No se pudieron cargar las zonas");
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.tokenAusente || !this.contenedor) return;
    mapboxgl.accessToken = environment.tokenMapboxPublico;

    this.mapa = new mapboxgl.Map({
      container: this.contenedor.nativeElement,
      style: ESTILO_MAPA,
      center: [-89.2182, 13.6929],
      zoom: 11,
    });

    this.mapa.addControl(new mapboxgl.NavigationControl(), "top-right");
    this.mapa.on("load", () => {
      this.mapaListo = true;
      const z = this.zonaSeleccionada();
      if (z) this.dibujarTodo(z);
    });
  }

  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = undefined;
    }
  }

  alCambiarZona(id: string): void {
    this.zonaSeleccionadaId = id;
    if (!id) {
      this.zonaSeleccionada.set(null);
      this.pedidos.set([]);
      this.repartidores.set([]);
      this.seleccionados.set(new Set());
      this.repartidorElegidoId.set(null);
      this.limpiarCapas();
      this.limpiarMarcadores();
      return;
    }
    this.cargarZona(id);
  }

  private cargarZona(id: string): void {
    this.cargandoZona.set(true);
    this.seleccionados.set(new Set());
    this.repartidorElegidoId.set(null);

    forkJoin({
      zona: this.zonasServicio.obtenerPorId(id),
      repartidores: this.zonasServicio.repartidoresPorZona(id),
      pedidos: this.pedidosServicio.listar({
        zonaId: id,
        estado: "PENDIENTE_ASIGNACION",
        limite: 200,
        pagina: 1,
      }),
    }).subscribe({
      next: ({ zona, repartidores, pedidos }) => {
        this.zonaSeleccionada.set(zona);
        this.repartidores.set(repartidores);
        this.pedidos.set(pedidos.datos);
        if (repartidores.length === 1) {
          this.repartidorElegidoId.set(repartidores[0].id);
        }
        this.cargandoZona.set(false);
        this.dibujarTodo(zona);
      },
      error: (e) => {
        this.cargandoZona.set(false);
        this.toast.error(
          e?.error?.mensaje ?? "No se pudieron cargar los datos de la zona",
        );
      },
    });
  }

  private dibujarTodo(zona: Zona): void {
    if (!this.mapa || !this.mapaListo) return;
    this.dibujarPoligono(zona);
    this.dibujarMarcadores();
    this.ajustarVista(zona);
  }

  private dibujarPoligono(zona: Zona): void {
    if (!this.mapa) return;
    const puntos = zona.poligono ?? [];
    this.limpiarCapas();
    if (puntos.length < 3) return;

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
  }

  private dibujarMarcadores(): void {
    if (!this.mapa) return;
    this.limpiarMarcadores();
    for (const p of this.pedidos()) {
      const el = document.createElement("div");
      el.className = "marcador-pedido";
      el.title = `${p.codigoSeguimiento} — ${p.nombreCliente}`;
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.togglePedido(p.id, el);
      });
      const m = new mapboxgl.Marker({ element: el })
        .setLngLat([p.longitudOrigen, p.latitudOrigen])
        .addTo(this.mapa);
      this.marcadores.set(p.id, m);
    }
  }

  private togglePedido(id: string, el: HTMLElement): void {
    const set = new Set(this.seleccionados());
    if (set.has(id)) {
      set.delete(id);
      el.classList.remove("seleccionado");
    } else {
      set.add(id);
      el.classList.add("seleccionado");
    }
    this.seleccionados.set(set);
  }

  private ajustarVista(zona: Zona): void {
    if (!this.mapa) return;
    const puntos = zona.poligono ?? [];
    const pedidos = this.pedidos();
    if (puntos.length === 0 && pedidos.length === 0) return;

    const primer: [number, number] =
      puntos.length > 0
        ? [puntos[0].lng, puntos[0].lat]
        : [pedidos[0].longitudOrigen, pedidos[0].latitudOrigen];
    const bounds = new mapboxgl.LngLatBounds(primer, primer);
    for (const p of puntos) bounds.extend([p.lng, p.lat]);
    for (const p of pedidos) bounds.extend([p.longitudOrigen, p.latitudOrigen]);
    this.mapa.fitBounds(bounds, { padding: 50, duration: 250, maxZoom: 15 });
  }

  private limpiarCapas(): void {
    if (!this.mapa || !this.mapaListo) return;
    if (this.mapa.getLayer(ID_CAPA_BORDE)) this.mapa.removeLayer(ID_CAPA_BORDE);
    if (this.mapa.getLayer(ID_CAPA_RELLENO))
      this.mapa.removeLayer(ID_CAPA_RELLENO);
    if (this.mapa.getSource(ID_FUENTE_ZONA))
      this.mapa.removeSource(ID_FUENTE_ZONA);
  }

  private limpiarMarcadores(): void {
    this.marcadores.forEach((m) => m.remove());
    this.marcadores.clear();
  }

  alSeleccionarRepartidor(id: string): void {
    this.repartidorElegidoId.set(id);
  }

  puedeAsignarSeleccionados(): boolean {
    return (
      !this.enviando() &&
      this.seleccionados().size > 0 &&
      !!this.repartidorElegidoId()
    );
  }

  asignarSeleccionados(): void {
    const repartidorId = this.repartidorElegidoId();
    const ids = Array.from(this.seleccionados());
    if (!repartidorId || ids.length === 0) return;
    this.ejecutarAsignacion(ids, repartidorId);
  }

  asignarTodosAlUnicoRider(): void {
    const repartidores = this.repartidores();
    if (repartidores.length !== 1) return;
    const ids = this.pedidos().map((p) => p.id);
    if (ids.length === 0) {
      this.toast.info("No hay pedidos pendientes en la zona");
      return;
    }
    this.ejecutarAsignacion(ids, repartidores[0].id);
  }

  private ejecutarAsignacion(
    pedidoIds: string[],
    repartidorRecogidaId: string,
  ): void {
    this.enviando.set(true);
    this.pedidosServicio
      .asignarMultiple({ pedidoIds, repartidorRecogidaId })
      .subscribe({
        next: (r) => {
          this.enviando.set(false);
          this.asignacionRealizada = true;
          if (r.fallidos.length === 0) {
            this.toast.success(`Asignados ${r.asignados} pedidos`);
          } else {
            this.toast.warning(
              `Asignados ${r.asignados}, fallidos ${r.fallidos.length}`,
            );
          }
          const zonaId = this.zonaSeleccionadaId;
          if (zonaId) this.cargarZona(zonaId);
        },
        error: (e) => {
          this.enviando.set(false);
          this.toast.error(
            e?.error?.mensaje ?? "No se pudo realizar la asignación",
          );
        },
      });
  }

  cerrar(): void {
    this.modal.close(this.asignacionRealizada ? "asignado" : "");
  }
}
