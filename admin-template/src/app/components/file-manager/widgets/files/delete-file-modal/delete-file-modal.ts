import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-file-modal',
  imports: [],
  templateUrl: './delete-file-modal.html',
  styleUrl: './delete-file-modal.scss',
})
export class DeleteFileModal {
  public activeModal = inject(NgbActiveModal);

  confirmDelete() {
    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
