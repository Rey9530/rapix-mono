import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-imagen-pedido-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./imagen-pedido.modal.html",
  styleUrl: "./imagen-pedido.modal.scss",
})
export class ImagenPedidoModal {
  @Input({ required: true }) urlImagen!: string;
  @Input() titulo = "Imagen";

  readonly modal = inject(NgbActiveModal);
}
