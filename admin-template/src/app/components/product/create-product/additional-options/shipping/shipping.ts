import { Component, input, output } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { shippingClass } from '../../../../../shared/data/product';

@Component({
  selector: 'app-shipping',
  imports: [Select2Module, SvgIcon],
  templateUrl: './shipping.html',
  styleUrl: './shipping.scss',
})
export class Shipping {
  readonly additionalActiveId = input<number>(0);
  readonly changeTabDetails = output<number>();

  public shippingClass = shippingClass;

  next() {
    const nextId = this.additionalActiveId() + 1;
    this.changeTabDetails.emit(nextId);
  }

  previous() {
    const prevId = this.additionalActiveId() - 1;
    this.changeTabDetails.emit(prevId);
  }
}
