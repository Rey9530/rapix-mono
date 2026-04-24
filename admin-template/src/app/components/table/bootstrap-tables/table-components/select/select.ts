import { Component } from '@angular/core';

import { Select2Data, Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-select',
  imports: [Select2Module, Card],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  public values: Select2Data = new Array();

  constructor() {
    for (let i = 1; i <= 5; i++) {
      this.values.push({ value: i, label: i.toString() });
    }
  }
}
