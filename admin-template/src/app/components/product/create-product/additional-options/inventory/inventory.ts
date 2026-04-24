import { Component, input, output } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import {
  stockAvailability,
  stockLevel,
} from '../../../../../shared/data/product';

@Component({
  selector: 'app-inventory',
  imports: [Select2Module, SvgIcon],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory {
  readonly active = input<number>();
  readonly additionalActiveId = input<number>();

  readonly changeTab = output<number>();
  readonly changeTabDetails = output<number>();

  public stockAvailability = stockAvailability;
  public stockLevel = stockLevel;

  next() {
    const nextTab = (this.additionalActiveId() ?? 1) + 1;
    this.changeTabDetails.emit(nextTab);
  }

  previous() {
    const prevActive = (this.active() ?? 1) - 1;
    this.changeTab.emit(prevActive);
  }
}
