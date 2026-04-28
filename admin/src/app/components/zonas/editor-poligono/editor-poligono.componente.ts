import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";

import { environment } from "../../../../environments/environment";
import { PuntoGeo } from "../../../nucleo/modelos/zona.modelo";

const CENTRO_DEFECTO: [number, number] = [-89.2182, 13.6929];
const ZOOM_DEFECTO = 12;
const ESTILO_MAPA = "mapbox://styles/mapbox/streets-v12";
const ID_FUENTE_LECTURA = "fuente-poligono-zona";
const ID_CAPA_RELLENO = "capa-relleno-poligono";
const ID_CAPA_BORDE = "capa-borde-poligono";

@Component({
  selector: "app-editor-poligono",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./editor-poligono.componente.html",
  styleUrl: "./editor-poligono.componente.scss",
})
export class EditorPoligonoComponente
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild("contenedor")
  contenedor?: ElementRef<HTMLDivElement>;

  @Input() puntos: PuntoGeo[] = [];
  @Input() modo: "lectura" | "edicion" = "edicion";
  @Input() centroInicial?: PuntoGeo;

  @Output() puntosCambiaron = new EventEmitter<PuntoGeo[]>();

  readonly tokenAusente = !environment.tokenMapboxPublico;

  private mapa?: mapboxgl.Map;
  private draw?: MapboxDraw;
  private mapaListo = false;

  ngAfterViewInit(): void {
    if (this.tokenAusente) return;
    if (!this.contenedor) return;
    mapboxgl.accessToken = environment.tokenMapboxPublico;

    const centro: [number, number] = this.centroInicial
      ? [this.centroInicial.lng, this.centroInicial.lat]
      : this.puntos.length > 0
        ? this.calcularCentroide(this.puntos)
        : CENTRO_DEFECTO;

    this.mapa = new mapboxgl.Map({
      container: this.contenedor.nativeElement,
      style: ESTILO_MAPA,
      center: centro,
      zoom: ZOOM_DEFECTO,
    });

    this.mapa.addControl(new mapboxgl.NavigationControl(), "top-right");

    this.mapa.on("load", () => {
      this.mapaListo = true;
      if (this.modo === "edicion") {
        this.configurarEdicion();
      } else {
        this.dibujarLectura();
      }
    });
  }

  ngOnChanges(cambios: SimpleChanges): void {
    if (!this.mapaListo || !this.mapa) return;
    if (cambios["puntos"] && !cambios["puntos"].firstChange) {
      if (this.modo === "lectura") {
        this.dibujarLectura();
      } else if (this.draw) {
        this.cargarPoligonoEnDraw();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.mapa) {
      this.mapa.remove();
      this.mapa = undefined;
    }
  }

  private configurarEdicion(): void {
    if (!this.mapa) return;
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      defaultMode: this.puntos.length > 0 ? "simple_select" : "draw_polygon",
    });
    this.mapa.addControl(this.draw);

    if (this.puntos.length > 0) {
      this.cargarPoligonoEnDraw();
    }

    const emitir = () => this.emitirDesdeDraw();
    this.mapa.on("draw.create", () => {
      this.mantenerSoloUltimoPoligono();
      emitir();
    });
    this.mapa.on("draw.update", emitir);
    this.mapa.on("draw.delete", emitir);
  }

  private cargarPoligonoEnDraw(): void {
    if (!this.draw) return;
    this.draw.deleteAll();
    if (this.puntos.length < 3) return;
    const anilloCerrado = this.puntos.map((p) => [p.lng, p.lat]);
    const primero = anilloCerrado[0];
    const ultimo = anilloCerrado[anilloCerrado.length - 1];
    if (primero[0] !== ultimo[0] || primero[1] !== ultimo[1]) {
      anilloCerrado.push([primero[0], primero[1]]);
    }
    this.draw.add({
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [anilloCerrado] },
    });
    this.ajustarVistaA(anilloCerrado);
  }

  private mantenerSoloUltimoPoligono(): void {
    if (!this.draw) return;
    const todos = this.draw.getAll().features;
    if (todos.length > 1) {
      const ids = todos.slice(0, -1).map((f) => f.id as string);
      this.draw.delete(ids);
    }
  }

  private emitirDesdeDraw(): void {
    if (!this.draw) {
      this.puntosCambiaron.emit([]);
      return;
    }
    const features = this.draw.getAll().features;
    if (features.length === 0) {
      this.puntosCambiaron.emit([]);
      return;
    }
    const feature = features[features.length - 1];
    if (
      feature.geometry.type !== "Polygon" ||
      !feature.geometry.coordinates[0]
    ) {
      this.puntosCambiaron.emit([]);
      return;
    }
    const anillo = feature.geometry.coordinates[0] as number[][];
    const abierto = this.abrirAnillo(anillo);
    const puntos: PuntoGeo[] = abierto.map(([lng, lat]) => ({ lat, lng }));
    this.puntosCambiaron.emit(puntos);
  }

  private dibujarLectura(): void {
    if (!this.mapa || !this.mapaListo) return;
    const fuenteExistente = this.mapa.getSource(ID_FUENTE_LECTURA);
    if (this.puntos.length < 3) {
      if (fuenteExistente) {
        if (this.mapa.getLayer(ID_CAPA_BORDE))
          this.mapa.removeLayer(ID_CAPA_BORDE);
        if (this.mapa.getLayer(ID_CAPA_RELLENO))
          this.mapa.removeLayer(ID_CAPA_RELLENO);
        this.mapa.removeSource(ID_FUENTE_LECTURA);
      }
      return;
    }
    const anillo = this.puntos.map((p) => [p.lng, p.lat]);
    const primero = anillo[0];
    anillo.push([primero[0], primero[1]]);
    const datos: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      properties: {},
      geometry: { type: "Polygon", coordinates: [anillo] },
    };
    if (fuenteExistente) {
      (fuenteExistente as mapboxgl.GeoJSONSource).setData(datos);
    } else {
      this.mapa.addSource(ID_FUENTE_LECTURA, { type: "geojson", data: datos });
      this.mapa.addLayer({
        id: ID_CAPA_RELLENO,
        type: "fill",
        source: ID_FUENTE_LECTURA,
        paint: { "fill-color": "#0d6efd", "fill-opacity": 0.25 },
      });
      this.mapa.addLayer({
        id: ID_CAPA_BORDE,
        type: "line",
        source: ID_FUENTE_LECTURA,
        paint: { "line-color": "#0d6efd", "line-width": 2 },
      });
    }
    this.ajustarVistaA(anillo);
  }

  private ajustarVistaA(anillo: number[][]): void {
    if (!this.mapa || anillo.length === 0) return;
    const bounds = anillo.reduce(
      (acc, [lng, lat]) => acc.extend([lng, lat] as [number, number]),
      new mapboxgl.LngLatBounds(
        anillo[0] as [number, number],
        anillo[0] as [number, number],
      ),
    );
    this.mapa.fitBounds(bounds, { padding: 40, duration: 0 });
  }

  private abrirAnillo(anillo: number[][]): number[][] {
    if (anillo.length < 2) return anillo;
    const primero = anillo[0];
    const ultimo = anillo[anillo.length - 1];
    if (primero[0] === ultimo[0] && primero[1] === ultimo[1]) {
      return anillo.slice(0, -1);
    }
    return anillo;
  }

  private calcularCentroide(puntos: PuntoGeo[]): [number, number] {
    const total = puntos.reduce(
      (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
      { lat: 0, lng: 0 },
    );
    return [total.lng / puntos.length, total.lat / puntos.length];
  }
}
