import { Component, TemplateRef, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-profile-modal',
  imports: [SvgIcon],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.scss',
})
export class ProfileModal {
  private modal = inject(NgbModal);

  openModal(value: TemplateRef<NgbModal>) {
    this.modal.open(value, { centered: true });
  }

  closeModal() {
    this.modal.dismissAll();
  }
}
