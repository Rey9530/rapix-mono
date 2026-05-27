import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import {
  ActualizarPedidoPayload,
  PedidosServicio,
} from "../../../nucleo/datos/pedidos.servicio";
import { RepartidoresServicio } from "../../../nucleo/datos/repartidores.servicio";
import {
  EstadoPedido,
  MetodoPago,
  ModoFacturacion,
  PedidoDetalle,
} from "../../../nucleo/modelos/pedido.modelo";
import { PerfilRepartidor } from "../../../nucleo/modelos/repartidor.modelo";
import {
  SelectorUbicacionModal,
  UbicacionSeleccionada,
} from "./selector-ubicacion.modal";

@Component({
  selector: "app-pedido-formulario-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./pedido-formulario.modal.html",
})
export class PedidoFormularioModal implements OnInit {
  @Input({ required: true }) pedido!: PedidoDetalle;

  readonly modal = inject(NgbActiveModal);
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(PedidosServicio);
  private readonly repartidoresServicio = inject(RepartidoresServicio);
  private readonly modalServicio = inject(NgbModal);
  private readonly toast = inject(ToastrService);

  readonly estados: EstadoPedido[] = [
    "PENDIENTE_ASIGNACION",
    "ASIGNADO",
    "RECOGIDO",
    "EN_TRANSITO",
    "EN_PUNTO_INTERCAMBIO",
    "EN_REPARTO",
    "ENTREGADO",
    "CANCELADO",
    "FALLIDO",
    "DEVUELTO",
  ];
  readonly metodosPago: MetodoPago[] = [
    "CONTRA_ENTREGA",
    "PREPAGADO",
    "TARJETA",
    "TRANSFERENCIA",
  ];
  readonly modosFacturacion: ModoFacturacion[] = ["POR_ENVIO", "PAQUETE"];

  repartidores: PerfilRepartidor[] = [];
  enviando = false;

  readonly form = this.fb.nonNullable.group({
    // Cliente
    nombreCliente: ["", [Validators.required, Validators.minLength(2)]],
    telefonoCliente: ["", [Validators.required, Validators.pattern(/^[267][0-9]{7}$/)]],
    emailCliente: [""],
    // Origen
    direccionOrigen: ["", [Validators.required]],
    latitudOrigen: [null as number | null],
    longitudOrigen: [null as number | null],
    notasOrigen: [""],
    // Destino
    direccionDestino: ["", [Validators.required]],
    latitudDestino: [null as number | null],
    longitudDestino: [null as number | null],
    notasDestino: [""],
    // Paquete
    descripcionPaquete: [""],
    pesoPaqueteKg: [null as number | null],
    valorDeclarado: [null as number | null],
    // Pago
    metodoPago: ["CONTRA_ENTREGA" as MetodoPago, [Validators.required]],
    montoContraEntrega: [null as number | null],
    programadoPara: [""],
    // Solo ADMIN
    estado: ["PENDIENTE_ASIGNACION" as EstadoPedido],
    modoFacturacion: ["POR_ENVIO" as ModoFacturacion],
    costoEnvio: [null as number | null],
    repartidorRecogidaId: [""],
    repartidorEntregaId: [""],
  });

  ngOnInit(): void {
    this.repartidoresServicio.listar().subscribe({
      next: (rs) => (this.repartidores = rs),
      error: () => (this.repartidores = []),
    });

    const p = this.pedido;
    this.form.patchValue({
      nombreCliente: p.nombreCliente,
      // El backend almacena el teléfono con prefijo +503; el DTO espera 8 dígitos.
      telefonoCliente: (p.telefonoCliente ?? "").replace(/^\+503/, ""),
      emailCliente: p.emailCliente ?? "",
      direccionOrigen: p.direccionOrigen,
      latitudOrigen: p.latitudOrigen ?? null,
      longitudOrigen: p.longitudOrigen ?? null,
      notasOrigen: p.notasOrigen ?? "",
      direccionDestino: p.direccionDestino,
      latitudDestino: p.latitudDestino ?? null,
      longitudDestino: p.longitudDestino ?? null,
      notasDestino: p.notasDestino ?? "",
      descripcionPaquete: p.descripcionPaquete ?? "",
      pesoPaqueteKg: this.aNumero(p.pesoPaqueteKg),
      valorDeclarado: this.aNumero(p.valorDeclarado),
      metodoPago: p.metodoPago,
      montoContraEntrega: this.aNumero(p.montoContraEntrega),
      programadoPara: this.aDatetimeLocal(p.programadoPara),
      estado: p.estado,
      modoFacturacion: p.modoFacturacion ?? "POR_ENVIO",
      costoEnvio: this.aNumero(p.costoEnvio),
      repartidorRecogidaId: p.repartidorRecogidaId ?? "",
      repartidorEntregaId: p.repartidorEntregaId ?? "",
    });

    this.form.controls.metodoPago.valueChanges.subscribe((m) =>
      this.aplicarValidadorMonto(m),
    );
    this.aplicarValidadorMonto(this.form.controls.metodoPago.value);
  }

  private aplicarValidadorMonto(metodo: MetodoPago): void {
    const ctrl = this.form.controls.montoContraEntrega;
    if (metodo === "CONTRA_ENTREGA") {
      ctrl.setValidators([Validators.required, Validators.min(0.01)]);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity({ emitEvent: false });
  }

  abrirSelectorUbicacion(tipo: "origen" | "destino"): void {
    const c = this.form.controls;
    const lat = tipo === "origen" ? c.latitudOrigen.value : c.latitudDestino.value;
    const lng = tipo === "origen" ? c.longitudOrigen.value : c.longitudDestino.value;

    const ref = this.modalServicio.open(SelectorUbicacionModal, {
      size: "lg",
      centered: true,
    });
    ref.componentInstance.lat = lat;
    ref.componentInstance.lng = lng;
    ref.componentInstance.titulo =
      tipo === "origen" ? "Ubicación de origen" : "Ubicación de destino";

    ref.closed.subscribe((res: UbicacionSeleccionada | undefined) => {
      if (!res) return;
      if (tipo === "origen") {
        c.latitudOrigen.setValue(res.lat);
        c.longitudOrigen.setValue(res.lng);
      } else {
        c.latitudDestino.setValue(res.lat);
        c.longitudDestino.setValue(res.lng);
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.armarPayload();
    if (Object.keys(payload).length === 0) {
      this.toast.info("No hay cambios para guardar");
      this.modal.dismiss();
      return;
    }

    this.enviando = true;
    this.servicio.actualizar(this.pedido.id, payload).subscribe({
      next: () => {
        this.toast.success("Pedido actualizado");
        this.modal.close("actualizado");
      },
      error: (e) => this.fallar(e),
    });
  }

  // Construye un payload solo con los campos que cambiaron respecto al pedido
  // original, para no re-resolver zonas ni enviar valores inválidos sin necesidad.
  private armarPayload(): ActualizarPedidoPayload {
    const v = this.form.getRawValue();
    const p = this.pedido;
    const payload: ActualizarPedidoPayload = {};

    if (v.nombreCliente !== p.nombreCliente)
      payload.nombreCliente = v.nombreCliente;

    const telActual = (p.telefonoCliente ?? "").replace(/^\+503/, "");
    if (v.telefonoCliente !== telActual)
      payload.telefonoCliente = v.telefonoCliente;

    // El backend no permite vaciar el email (DTO @IsEmail): solo se envía si
    // tiene valor y cambió.
    if (v.emailCliente && v.emailCliente !== (p.emailCliente ?? ""))
      payload.emailCliente = v.emailCliente;

    if (v.direccionOrigen !== p.direccionOrigen)
      payload.direccionOrigen = v.direccionOrigen;
    if (v.notasOrigen !== (p.notasOrigen ?? ""))
      payload.notasOrigen = v.notasOrigen;
    if (v.direccionDestino !== p.direccionDestino)
      payload.direccionDestino = v.direccionDestino;
    if (v.notasDestino !== (p.notasDestino ?? ""))
      payload.notasDestino = v.notasDestino;
    if (v.descripcionPaquete !== (p.descripcionPaquete ?? ""))
      payload.descripcionPaquete = v.descripcionPaquete;

    // Coordenadas: el backend exige lat Y lng juntos para re-resolver la zona.
    if (
      v.latitudOrigen != null &&
      v.longitudOrigen != null &&
      (v.latitudOrigen !== p.latitudOrigen ||
        v.longitudOrigen !== p.longitudOrigen)
    ) {
      payload.latitudOrigen = v.latitudOrigen;
      payload.longitudOrigen = v.longitudOrigen;
    }
    if (
      v.latitudDestino != null &&
      v.longitudDestino != null &&
      (v.latitudDestino !== p.latitudDestino ||
        v.longitudDestino !== p.longitudDestino)
    ) {
      payload.latitudDestino = v.latitudDestino;
      payload.longitudDestino = v.longitudDestino;
    }

    // Numéricos positivos: solo se envían si tienen valor y cambiaron.
    if (v.pesoPaqueteKg != null && v.pesoPaqueteKg !== this.aNumero(p.pesoPaqueteKg))
      payload.pesoPaqueteKg = v.pesoPaqueteKg;
    if (v.valorDeclarado != null && v.valorDeclarado !== this.aNumero(p.valorDeclarado))
      payload.valorDeclarado = v.valorDeclarado;
    if (
      v.montoContraEntrega != null &&
      v.montoContraEntrega !== this.aNumero(p.montoContraEntrega)
    )
      payload.montoContraEntrega = v.montoContraEntrega;

    if (v.metodoPago !== p.metodoPago) payload.metodoPago = v.metodoPago;

    if (v.programadoPara && v.programadoPara !== this.aDatetimeLocal(p.programadoPara))
      payload.programadoPara = new Date(v.programadoPara).toISOString();

    // ─── Solo ADMIN ───
    if (v.estado !== p.estado) payload.estado = v.estado;
    if (v.modoFacturacion !== (p.modoFacturacion ?? "POR_ENVIO"))
      payload.modoFacturacion = v.modoFacturacion;
    if (v.costoEnvio != null && v.costoEnvio !== this.aNumero(p.costoEnvio))
      payload.costoEnvio = v.costoEnvio;

    const recogida = v.repartidorRecogidaId || null;
    if (recogida !== (p.repartidorRecogidaId ?? null))
      payload.repartidorRecogidaId = recogida;
    const entrega = v.repartidorEntregaId || null;
    if (entrega !== (p.repartidorEntregaId ?? null))
      payload.repartidorEntregaId = entrega;

    return payload;
  }

  private aNumero(valor: string | null | undefined): number | null {
    if (valor == null || valor === "") return null;
    const n = Number(valor);
    return Number.isNaN(n) ? null : n;
  }

  // ISO 8601 → "YYYY-MM-DDTHH:mm" en hora local (para <input type="datetime-local">).
  private aDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
  }

  private fallar(error: {
    error?: { mensaje?: string; message?: string | string[] };
  }): void {
    this.enviando = false;
    const mensaje =
      error.error?.mensaje ??
      (Array.isArray(error.error?.message)
        ? error.error?.message.join(", ")
        : (error.error?.message as string)) ??
      "No se pudo guardar el pedido";
    this.toast.error(mensaje);
  }
}
