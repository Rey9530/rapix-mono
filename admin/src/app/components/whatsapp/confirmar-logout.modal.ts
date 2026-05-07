import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-confirmar-logout-modal",
  imports: [CommonModule],
  templateUrl: "./confirmar-logout.modal.html",
})
export class ConfirmarLogoutModal {
  readonly modal = inject(NgbActiveModal);
}
