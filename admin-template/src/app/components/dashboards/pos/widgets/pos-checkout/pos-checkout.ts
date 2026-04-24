import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { checkoutMethod } from '../../../../../shared/data/dashboard/pos';
import { CartService } from '../../../../../shared/services/cart.service';
import { CreateCustomerModal } from '../create-customer-modal/create-customer-modal';

@Component({
  selector: 'app-pos-checkout',
  imports: [RouterModule, FeatherIcon, DecimalPipe],
  templateUrl: './pos-checkout.html',
  styleUrl: './pos-checkout.scss',
})
export class PosCheckout {
  cartService = inject(CartService);
  private modal = inject(NgbModal);

  public checkoutMethod = checkoutMethod;

  openModal() {
    this.modal.open(CreateCustomerModal, {
      centered: true,
      size: 'lg',
      modalDialogClass: 'create-customers custom-input',
    });
  }
}
