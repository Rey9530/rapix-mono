import { Component, TemplateRef, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Balance } from '../../../../dashboards/crypto/widgets/balance/balance';

@Component({
  selector: 'app-balance-modal',
  imports: [Balance],
  templateUrl: './balance-modal.html',
  styleUrl: './balance-modal.scss',
})
export class BalanceModal {
  private modal = inject(NgbModal);

  openModal(value: TemplateRef<NgbModal>) {
    this.modal.open(value, { centered: true });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
