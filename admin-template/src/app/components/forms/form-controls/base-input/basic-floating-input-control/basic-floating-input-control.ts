import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  selectMenu,
  selectNumber,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-basic-floating-input-control',
  imports: [Select2Module, Card],
  templateUrl: './basic-floating-input-control.html',
  styleUrl: './basic-floating-input-control.scss',
})
export class BasicFloatingInputControl {
  public selectNumber = selectNumber;
  public selectMenu = selectMenu;
}
