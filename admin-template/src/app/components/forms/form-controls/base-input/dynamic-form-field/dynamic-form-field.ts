import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { IDynamicForm } from '../../../../../shared/interface/form-controls';

@Component({
  selector: 'app-dynamic-form-field',
  imports: [Card],
  templateUrl: './dynamic-form-field.html',
  styleUrl: './dynamic-form-field.scss',
})
export class DynamicFormField {
  public items: IDynamicForm[] = [];

  constructor() {
    this.items.push({
      items: 'Watch',
      price: '550',
      qty: '2',
      total_price: '11000',
    });
  }

  addItem() {
    this.items.push({
      items: '',
      price: '',
      qty: '',
      total_price: '',
    });
  }

  removeItem(i: number) {
    this.items.splice(i, 1);
  }
}
