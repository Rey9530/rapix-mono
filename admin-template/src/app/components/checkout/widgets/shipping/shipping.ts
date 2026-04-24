import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddressModal } from '../../../../shared/components/ui/modal/address-modal/address-modal';
import { user } from '../../../../shared/data/user';

@Component({
  selector: 'app-shipping',
  imports: [],
  templateUrl: './shipping.html',
  styleUrl: './shipping.scss',
})
export class Shipping {
  private modal = inject(NgbModal);

  public userDetails = user;

  openAddressModal() {
    this.modal.open(AddressModal, { size: 'lg', centered: true });
  }
}
