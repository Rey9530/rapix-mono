import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  inject,
} from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import mapboxgl from "mapbox-gl";

import { environment } from "../../../../environments/environment";
import { PedidoDetalle } from "../../../nucleo/modelos/pedido.modelo";

const ESTILO_MAPA = "mapbox://styles/mapbox/streets-v12";
const ID_FUENTE_RUTA = "fuente-ruta-pedido";
const ID_CAPA_RUTA = "capa-ruta-pedido";
const COLOR_RUTA = "#0d6efd";

@Component({
  selector: "app-mapa-pedido-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./mapa-pedido.modal.html",
  styleUrl: "./mapa-pedido.modal.scss",
})
export class MapaPedidoModal implements AfterViewInit, OnDestroy {
  @Input({ required: true }) pedido!: PedidoDetalle;

  @ViewChild("contenedor")
  contenedor?: ElementRef<HTMLDivElement>;

  readonly modal = inject(NgbActiveModal);
  readonly tokenAusente = !environment.tokenMapboxPublico;

  private mapa?: mapboxgl.Map;

  ngAfterViewInit(): void {
    if (this.tokenAusente || !this.contenedor) return;

    mapboxgl.accessToken = environment.tokenMapboxPublico;

    const origen: [number, number] = [
      this.pedido.longitudOrigen,
      this.pedido.latitudOrigen,
    ];
    const destino: [number, number] = [
      this.pedido.longitudDestino,
      this.pedido.latitudDestino,
    ];

    this.mapa = new mapboxgl.Map({
      container: this.contenedor.nativeElement,
      style: ESTILO_MAPA,
      center: origen,
      zoom: 12,
    });

    this.mapa.addControl(new mapboxgl.NavigationControl(), "top-right");

    new mapboxgl.Marker({ color: "#198754" })
      .setLngLat(origen)
      .setPopup(
        new mapboxgl.Popup({ offset: 24 }).setText(
          `Origen: ${this.pedido.direccionOrigen}`,
        ),
      )
      .addTo(this.mapa);

    new mapboxgl.Marker({ color: "#dc3545" })
      .setLngLat(destino)
      .setPopup(
        new mapboxgl.Popup({ offset: 24 }).setText(
          `Destino: ${this.pedido.direccionDestino}`,
        ),
      )
      .addTo(this.mapa);

    const bounds = new mapboxgl.LngLatBounds(origen, origen).extend(destino);

    this.mapa.on("load", () => {
      this.mapa?.fitBounds(bounds, { padding: 60, duration: 0, maxZoom: 15 });
      this.cargarRuta(origen, destino);
    });
  }

  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = undefined;
    }
  }

  private async cargarRuta(
    origen: [number, number],
    destino: [number, number],
  ): Promise<void> {
    if (!this.mapa) return;

    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${origen[0]},${origen[1]};${destino[0]},${destino[1]}` +
      `?geometries=geojson&overview=full&access_token=${environment.tokenMapboxPublico}`;

    let geometria: GeoJSON.Geometry;
    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("respuesta_no_ok");
      const datos = await respuesta.json();
      const ruta = datos?.routes?.[0]?.geometry;
      if (!ruta) throw new Error("sin_ruta");
      geometria = ruta as GeoJSON.Geometry;
    } catch {
      geometria = {
        type: "LineString",
        coordinates: [origen, destino],
      };
    }

    if (!this.mapa) return;

    this.mapa.addSource(ID_FUENTE_RUTA, {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: geometria },
    });
    this.mapa.addLayer({
      id: ID_CAPA_RUTA,
      type: "line",
      source: ID_FUENTE_RUTA,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": COLOR_RUTA, "line-width": 4, "line-opacity": 0.8 },
    });
  }
}
