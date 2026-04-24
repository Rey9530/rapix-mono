import { Component } from '@angular/core';

import { ISlot } from '../../../../shared/interface/dashboard/e-commerce';

@Component({
  selector: 'app-delivery',
  imports: [],
  templateUrl: './delivery.html',
  styleUrl: './delivery.scss',
})
export class Delivery {
  public slots: ISlot[] = [];

  constructor() {
    this.slots.push({
      slot: 'Morning',
      time: '8.00 AM - 12.00 AM',
    });
  }

  addSlot() {
    this.slots.push({
      slot: '',
      time: '',
    });
  }

  removeSlot(i: number) {
    this.slots.splice(i, 1);
  }
}
