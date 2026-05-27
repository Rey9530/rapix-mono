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

const ESTILO_MAPA = "mapbox://styles/mapbox/streets-v12";
// Centro por defecto: San Salvador (igual que el editor de polígonos de zonas).
const CENTRO_DEFECTO: [number, number] = [-89.2182, 13.6929];
const ZOOM_DEFECTO = 13;

export interface UbicacionSeleccionada {
  lat: number;
  lng: number;
}

@Component({
  selector: "app-selector-ubicacion-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./selector-ubicacion.modal.html",
  styleUrl: "./selector-ubicacion.modal.scss",
})
export class SelectorUbicacionModal implements AfterViewInit, OnDestroy {
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() titulo = "Seleccionar ubicación";

  @ViewChild("contenedor")
  contenedor?: ElementRef<HTMLDivElement>;

  readonly modal = inject(NgbActiveModal);
  readonly tokenAusente = !environment.tokenMapboxPublico;

  // Posición seleccionada actual (se actualiza al arrastrar o hacer clic).
  latActual: number | null = null;
  lngActual: number | null = null;

  private mapa?: mapboxgl.Map;
  private marcador?: mapboxgl.Marker;

  ngAfterViewInit(): void {
    if (this.tokenAusente || !this.contenedor) return;

    mapboxgl.accessToken = environment.tokenMapboxPublico;

    const tienePunto = this.lat != null && this.lng != null;
    const centro: [number, number] = tienePunto
      ? [this.lng as number, this.lat as number]
      : CENTRO_DEFECTO;

    if (tienePunto) {
      this.latActual = this.lat;
      this.lngActual = this.lng;
    }

    this.mapa = new mapboxgl.Map({
      container: this.contenedor.nativeElement,
      style: ESTILO_MAPA,
      center: centro,
      zoom: ZOOM_DEFECTO,
    });

    this.mapa.addControl(new mapboxgl.NavigationControl(), "top-right");

    this.marcador = new mapboxgl.Marker({ color: "#0d6efd", draggable: true })
      .setLngLat(centro)
      .addTo(this.mapa);

    // Si no había punto inicial, el marcador en el centro aún no es una
    // selección válida hasta que el usuario lo mueva o haga clic.
    if (!tienePunto) {
      this.marcador.getElement().style.opacity = "0.5";
    }

    this.marcador.on("dragend", () => this.tomarDesdeMarcador());
    this.mapa.on("click", (e) => {
      this.marcador?.setLngLat(e.lngLat);
      this.marcador?.getElement().style.removeProperty("opacity");
      this.tomarDesdeMarcador();
    });
  }

  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = undefined;
    }
  }

  private tomarDesdeMarcador(): void {
    const lngLat = this.marcador?.getLngLat();
    if (!lngLat) return;
    this.latActual = lngLat.lat;
    this.lngActual = lngLat.lng;
  }

  confirmar(): void {
    if (this.latActual == null || this.lngActual == null) return;
    this.modal.close({
      lat: this.latActual,
      lng: this.lngActual,
    } satisfies UbicacionSeleccionada);
  }
}
