import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { DepositosServicio } from "../../nucleo/datos/depositos.servicio";
import { DepositoDetalleModal } from "./deposito-detalle.modal";
import {
  CuentaBancariaOpcion,
  DepositoVendedor,
  FiltrosDepositosAdmin,
  PaquetePendiente,
  SaldoPendienteVendedor,
  VendedorOpcion,
} from "../../nucleo/modelos/deposito.modelo";

const TAMANO_MAXIMO_MB = 10;

@Component({
  selector: "app-depositos",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./depositos.html",
  styleUrl: "./depositos.scss",
})
export class Depositos implements OnInit {
  private readonly servicio = inject(DepositosServicio);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastrService);
  private readonly modal = inject(NgbModal);

  readonly vendedores = signal<VendedorOpcion[]>([]);
  readonly vendedorSeleccionadoId = signal<string | null>(null);
  readonly saldo = signal<SaldoPendienteVendedor | null>(null);
  readonly cuentasBancarias = signal<CuentaBancariaOpcion[]>([]);
  readonly seleccionados = signal<Set<string>>(new Set<string>());
  readonly comprobante = signal<File | null>(null);
  readonly cargandoVendedores = signal(false);
  readonly cargandoSaldo = signal(false);
  readonly enviando = signal(false);
  readonly mensajeError = signal<string | null>(null);

  readonly historial = signal<DepositoVendedor[]>([]);
  readonly historialTotal = signal(0);
  readonly historialTotalPaginas = signal(0);
  readonly cargandoHistorial = signal(false);
  readonly historialAbierto = signal(false);
  filtrosHistorial: FiltrosDepositosAdmin = { pagina: 1, limite: 10 };

  readonly form = this.fb.group({
    fechaDeposito: [this.hoyComoIsoDate(), Validators.required],
    cuentaBancariaId: [""],
    referencia: ["", [Validators.maxLength(100)]],
    notas: ["", [Validators.maxLength(500)]],
  });

  readonly sumaSeleccionada = computed(() => {
    const sel = this.seleccionados();
    const paquetes = this.saldo()?.paquetes ?? [];
    return paquetes
      .filter((p) => sel.has(p.id))
      .reduce((acc, p) => acc + this.aNumero(p.montoContraEntrega), 0);
  });

  readonly puedeRegistrar = computed(
    () =>
      !!this.vendedorSeleccionadoId() &&
      this.seleccionados().size > 0 &&
      !!this.comprobante() &&
      this.form.valid &&
      !this.enviando(),
  );

  ngOnInit(): void {
    this.cargarVendedores();
    this.cargarHistorial();
  }

  // ──────────────────────────────────────────────────
  // Carga inicial
  // ──────────────────────────────────────────────────

  private cargarVendedores(): void {
    this.cargandoVendedores.set(true);
    this.servicio.listarVendedores().subscribe({
      next: (v) => {
        this.vendedores.set(v);
        this.cargandoVendedores.set(false);
      },
      error: (e) => {
        this.cargandoVendedores.set(false);
        this.mensajeError.set(
          e?.error?.mensaje ?? "No se pudieron cargar los vendedores.",
        );
      },
    });
  }

  // ──────────────────────────────────────────────────
  // Selección de vendedor → carga saldo pendiente
  // ──────────────────────────────────────────────────

  alCambiarVendedor(id: string): void {
    const idLimpio = id || null;
    this.vendedorSeleccionadoId.set(idLimpio);
    this.seleccionados.set(new Set<string>());
    this.saldo.set(null);
    this.cuentasBancarias.set([]);
    this.form.patchValue({ cuentaBancariaId: "" });
    if (!idLimpio) return;
    this.cargandoSaldo.set(true);
    this.servicio.saldoPendienteDe(idLimpio).subscribe({
      next: (s) => {
        this.saldo.set(s);
        this.cargandoSaldo.set(false);
      },
      error: (e) => {
        this.cargandoSaldo.set(false);
        this.toast.error(
          e?.error?.mensaje ?? "No se pudo cargar el saldo pendiente.",
        );
      },
    });
    this.servicio.cuentasBancariasDe(idLimpio).subscribe({
      next: (cuentas) => this.cuentasBancarias.set(cuentas),
      error: () => this.cuentasBancarias.set([]),
    });
  }

  // ──────────────────────────────────────────────────
  // Selección de paquetes
  // ──────────────────────────────────────────────────

  alAlternarPaquete(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = new Set(this.seleccionados());
    if (checked) next.add(id);
    else next.delete(id);
    this.seleccionados.set(next);
  }

  alSeleccionarTodos(): void {
    const todos = this.saldo()?.paquetes ?? [];
    this.seleccionados.set(new Set(todos.map((p) => p.id)));
  }

  alLimpiarSeleccion(): void {
    this.seleccionados.set(new Set<string>());
  }

  estaSeleccionado(id: string): boolean {
    return this.seleccionados().has(id);
  }

  // ──────────────────────────────────────────────────
  // Comprobante
  // ──────────────────────────────────────────────────

  alSeleccionarComprobante(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = "";
    if (!archivo) return;
    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      this.toast.error(`El archivo excede el límite de ${TAMANO_MAXIMO_MB} MB.`);
      return;
    }
    if (!archivo.type.startsWith("image/")) {
      this.toast.error("El comprobante debe ser una imagen (JPG, PNG, WebP).");
      return;
    }
    this.comprobante.set(archivo);
  }

  quitarComprobante(): void {
    this.comprobante.set(null);
  }

  formatearTamano(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  formatearCuenta(c: CuentaBancariaOpcion): string {
    const ultimos4 = c.numeroCuenta.slice(-4);
    const tipo = c.tipoCuenta === "AHORRO" ? "Ahorro" : "Corriente";
    const aliasParte = c.alias ? ` — ${c.alias}` : "";
    const principalParte = c.esPrincipal ? " (Principal)" : "";
    return `${c.banco.nombre} · ${tipo} ****${ultimos4}${aliasParte}${principalParte}`;
  }

  // ──────────────────────────────────────────────────
  // Registrar depósito
  // ──────────────────────────────────────────────────

  registrar(): void {
    if (!this.puedeRegistrar()) return;
    const vendedorId = this.vendedorSeleccionadoId();
    const archivo = this.comprobante();
    if (!vendedorId || !archivo) return;
    const valores = this.form.getRawValue();
    this.enviando.set(true);
    this.servicio
      .crear({
        vendedorId,
        pedidoIds: Array.from(this.seleccionados()),
        cuentaBancariaId: valores.cuentaBancariaId || undefined,
        fechaDeposito: valores.fechaDeposito || undefined,
        referencia: valores.referencia?.trim() || undefined,
        notas: valores.notas?.trim() || undefined,
        comprobante: archivo,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.toast.success("Depósito registrado correctamente.");
          this.alCambiarVendedor(vendedorId);
          this.form.patchValue({
            referencia: "",
            notas: "",
            cuentaBancariaId: "",
          });
          this.comprobante.set(null);
          this.cargarHistorial();
        },
        error: (e) => {
          this.enviando.set(false);
          const detalle = e?.error?.mensaje ?? e?.error?.message;
          this.toast.error(
            detalle ?? "No se pudo registrar el depósito.",
          );
        },
      });
  }

  // ──────────────────────────────────────────────────
  // Historial
  // ──────────────────────────────────────────────────

  alternarHistorial(): void {
    this.historialAbierto.update((v) => !v);
  }

  cargarHistorial(): void {
    this.cargandoHistorial.set(true);
    this.servicio.listar(this.filtrosHistorial).subscribe({
      next: (r) => {
        this.historial.set(r.datos);
        this.historialTotal.set(r.meta.total);
        this.historialTotalPaginas.set(r.meta.totalPaginas);
        this.cargandoHistorial.set(false);
      },
      error: () => {
        this.cargandoHistorial.set(false);
      },
    });
  }

  verDetalle(d: DepositoVendedor): void {
    const ref = this.modal.open(DepositoDetalleModal, {
      size: "xl",
      centered: true,
      scrollable: true,
    });
    ref.componentInstance.depositoId = d.id;
  }

  irPaginaHistorial(p: number): void {
    if (p < 1 || (this.historialTotalPaginas() && p > this.historialTotalPaginas()))
      return;
    this.filtrosHistorial = { ...this.filtrosHistorial, pagina: p };
    this.cargarHistorial();
  }

  // ──────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────

  trackPaquete(_indice: number, p: PaquetePendiente): string {
    return p.id;
  }

  trackDeposito(_indice: number, d: DepositoVendedor): string {
    return d.id;
  }

  private aNumero(v: string | number | null | undefined): number {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  private hoyComoIsoDate(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
}
