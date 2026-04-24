import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-customer-modal',
  imports: [],
  templateUrl: './create-customer-modal.html',
  styleUrl: './create-customer-modal.scss',
})
export class CreateCustomerModal {
  private modal = inject(NgbActiveModal);

  closeModal() {
    this.modal.close();
  }
}
