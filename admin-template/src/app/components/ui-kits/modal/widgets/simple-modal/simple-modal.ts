import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-simple-modal',
  imports: [FeatherIcon],
  templateUrl: './simple-modal.html',
  styleUrl: './simple-modal.scss',
})
export class SimpleModal {
  private modal = inject(NgbActiveModal);

  closeModal() {
    this.modal.close();
  }
}
