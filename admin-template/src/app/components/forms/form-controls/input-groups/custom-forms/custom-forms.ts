import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  selectChocolates,
  selectColor,
  selectTheme,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-custom-forms',
  imports: [Select2Module, Card],
  templateUrl: './custom-forms.html',
  styleUrl: './custom-forms.scss',
})
export class CustomForms {
  public selectTheme = selectTheme;
  public selectColor = selectColor;
  public selectChocolates = selectChocolates;
}
