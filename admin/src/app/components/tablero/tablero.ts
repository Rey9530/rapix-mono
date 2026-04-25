import { Component, OnInit, inject, signal } from "@angular/core";

import { forkJoin } from "rxjs";

import { CierresServicio } from "../../nucleo/datos/cierres.servicio";
import { PedidosServicio } from "../../nucleo/datos/pedidos.servicio";
import { UsuariosServicio } from "../../nucleo/datos/usuarios.servicio";

interface ResumenKpi {
  pedidosTotales: number;
  pedidosEntregados: number;
  cierresPendientes: number;
  vendedores: number;
  repartidores: number;
}

@Component({
  selector: "app-tablero",
  templateUrl: "./tablero.html",
  styleUrl: "./tablero.scss",
})
export class Tablero implements OnInit {
  private readonly pedidos = inject(PedidosServicio);
  private readonly cierres = inject(CierresServicio);
  private readonly usuarios = inject(UsuariosServicio);

  readonly cargando = signal(true);
  readonly kpis = signal<ResumenKpi | null>(null);

  ngOnInit(): void {
    forkJoin({
      pedidosTotales: this.pedidos.listar({ pagina: 1, limite: 1 }),
      pedidosEntregados: this.pedidos.listar({
        pagina: 1,
        limite: 1,
        estado: "ENTREGADO",
      }),
      cierresPendientes: this.cierres.listar({
        pagina: 1,
        limite: 1,
        estado: "PENDIENTE_REVISION",
      }),
      vendedores: this.usuarios.listar({
        pagina: 1,
        limite: 1,
        rol: "VENDEDOR",
      }),
      repartidores: this.usuarios.listar({
        pagina: 1,
        limite: 1,
        rol: "REPARTIDOR",
      }),
    }).subscribe({
      next: (r) => {
        this.kpis.set({
          pedidosTotales: r.pedidosTotales.meta.total,
          pedidosEntregados: r.pedidosEntregados.meta.total,
          cierresPendientes: r.cierresPendientes.meta.total,
          vendedores: r.vendedores.meta.total,
          repartidores: r.repartidores.meta.total,
        });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
