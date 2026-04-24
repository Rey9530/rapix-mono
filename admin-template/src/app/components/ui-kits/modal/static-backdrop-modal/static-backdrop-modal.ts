import { Component, TemplateRef, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-static-backdrop-modal',
  imports: [Card],
  templateUrl: './static-backdrop-modal.html',
  styleUrl: './static-backdrop-modal.scss',
})
export class StaticBackdropModal {
  private modal = inject(NgbModal);

  openModal(value: TemplateRef<NgbModal>) {
    this.modal.open(value, { backdrop: 'static' });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
