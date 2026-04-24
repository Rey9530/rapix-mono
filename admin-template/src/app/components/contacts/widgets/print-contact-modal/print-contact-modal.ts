import { Component, inject, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';

import { IContact } from '../../../../shared/interface/contacts';

@Component({
  selector: 'app-print-contact-modal',
  imports: [NgxPrintModule],
  templateUrl: './print-contact-modal.html',
  styleUrl: './print-contact-modal.scss',
})
export class PrintContactModal {
  private modal = inject(NgbActiveModal);

  @Input() activeContact: IContact;

  closeModal() {
    this.modal.close();
  }
}
