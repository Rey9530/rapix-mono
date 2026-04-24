import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  selectNumber,
  selectPainting,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-flat-input-style',
  imports: [Select2Module, Card],
  templateUrl: './flat-input-style.html',
  styleUrl: './flat-input-style.scss',
})
export class FlatInputStyle {
  public selectNumber = selectNumber;
  public selectPainting = selectPainting;
}
