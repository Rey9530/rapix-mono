import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CartSidebar } from './cart-sidebar/cart-sidebar';
import { Card } from '../../shared/components/ui/card/card';
import { SvgIcon } from '../../shared/components/ui/svg-icon/svg-icon';
import { IOrderDetailsProduct } from '../../shared/interface/order';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [
    NgbTooltipModule,
    RouterModule,
    Card,
    SvgIcon,
    CartSidebar,
    DecimalPipe,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);

  public selected: number[] = [];

  checkUncheckAll(event: Event) {
    this.cartService.cartItems.forEach((item: IOrderDetailsProduct) => {
      item.is_checked = (<HTMLInputElement>event?.target)?.checked;
      this.setSelectedItem(
        (<HTMLInputElement>event?.target)?.checked,
        item?.id,
      );
    });
  }

  onItemChecked(event: Event) {
    this.setSelectedItem(
      (<HTMLInputElement>event.target)?.checked,
      Number((<HTMLInputElement>event.target)?.value),
    );
  }

  setSelectedItem(checked: Boolean, value: Number) {
    const index = this.selected.indexOf(Number(value));
    if (checked) {
      if (index == -1) this.selected.push(Number(value));
    } else {
      this.selected = this.selected.filter((id) => id !== Number(value));
    }
  }
}
