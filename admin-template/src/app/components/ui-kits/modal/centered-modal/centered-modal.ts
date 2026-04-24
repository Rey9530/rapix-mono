import { Component, TemplateRef, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-centered-modal',
  imports: [Card],
  templateUrl: './centered-modal.html',
  styleUrl: './centered-modal.scss',
})
export class CenteredModal {
  private modal = inject(NgbModal);

  openModal(value: TemplateRef<NgbModal>) {
    this.modal.open(value, { centered: true });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
