import { Component, TemplateRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-toggle-between-modal',
  imports: [RouterModule, Card],
  templateUrl: './toggle-between-modal.html',
  styleUrl: './toggle-between-modal.scss',
})
export class ToggleBetweenModal {
  private modal = inject(NgbModal);

  openModal(value: TemplateRef<NgbModal>) {
    this.closeModal();
    this.modal.open(value, { centered: true });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
