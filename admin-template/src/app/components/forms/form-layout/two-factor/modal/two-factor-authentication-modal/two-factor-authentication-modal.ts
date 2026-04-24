import { Component, inject } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ScanQrCodeModal } from '../scan-qr-code-modal/scan-qr-code-modal';

@Component({
  selector: 'app-two-factor-authentication-modal',
  imports: [],
  templateUrl: './two-factor-authentication-modal.html',
  styleUrl: './two-factor-authentication-modal.scss',
})
export class TwoFactorAuthenticationModal {
  private activeModal = inject(NgbActiveModal);
  private modal = inject(NgbModal);

  closeModal() {
    this.activeModal.close();
  }

  next() {
    this.modal.open(ScanQrCodeModal, { centered: true });
  }
}
