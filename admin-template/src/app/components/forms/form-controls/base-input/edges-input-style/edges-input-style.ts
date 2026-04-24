import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import { themeSelection } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-edges-input-style',
  imports: [Select2Module, Card],
  templateUrl: './edges-input-style.html',
  styleUrl: './edges-input-style.scss',
})
export class EdgesInputStyle {
  public themeSelection = themeSelection;
}
