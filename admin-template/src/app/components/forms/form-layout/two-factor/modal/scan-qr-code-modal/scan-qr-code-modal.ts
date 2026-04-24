import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scan-qr-code-modal',
  imports: [],
  templateUrl: './scan-qr-code-modal.html',
  styleUrl: './scan-qr-code-modal.scss',
})
export class ScanQrCodeModal {
  private activeModal = inject(NgbActiveModal);

  closeModal() {
    this.activeModal.close();
  }
}
