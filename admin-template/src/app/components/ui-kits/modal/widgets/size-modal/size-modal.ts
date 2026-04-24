import { Component, inject, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-size-modal',
  imports: [FeatherIcon],
  templateUrl: './size-modal.html',
  styleUrl: './size-modal.scss',
})
export class SizeModal {
  private modal = inject(NgbActiveModal);

  @Input() title: string = '';
  @Input() buttons: boolean = false;

  closeModal() {
    this.modal.close();
  }
}
