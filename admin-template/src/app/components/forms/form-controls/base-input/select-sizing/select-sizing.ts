import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import { selectSizing } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-select-sizing',
  imports: [Select2Module, Card],
  templateUrl: './select-sizing.html',
  styleUrl: './select-sizing.scss',
})
export class SelectSizing {
  public selectSizing = selectSizing;
}
