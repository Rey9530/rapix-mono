import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TwoFactorAuthenticationModal } from '../modal/two-factor-authentication-modal/two-factor-authentication-modal';

@Component({
  selector: 'app-two-factor-authentication',
  imports: [],
  templateUrl: './two-factor-authentication.html',
  styleUrl: './two-factor-authentication.scss',
})
export class TwoFactorAuthentication {
  private modal = inject(NgbModal);

  openModal() {
    this.modal.open(TwoFactorAuthenticationModal, { centered: true });
  }
}
