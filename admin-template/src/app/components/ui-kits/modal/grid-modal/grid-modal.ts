import { Component, TemplateRef, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-grid-modal',
  imports: [Card],
  templateUrl: './grid-modal.html',
  styleUrl: './grid-modal.scss',
})
export class GridModal {
  private modal = inject(NgbModal);

  openModal(value: TemplateRef<NgbModal>) {
    this.modal.open(value, { centered: true, modalDialogClass: 'modal-box' });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
