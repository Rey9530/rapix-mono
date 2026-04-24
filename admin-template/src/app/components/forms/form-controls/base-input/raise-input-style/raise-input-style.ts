import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  selectColor,
  themeSelection,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-raise-input-style',
  imports: [Select2Module, Card],
  templateUrl: './raise-input-style.html',
  styleUrl: './raise-input-style.scss',
})
export class RaiseInputStyle {
  public themeSelection = themeSelection;
  public selectColor = selectColor;
}
