import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import { selectTheme } from '../../../../../shared/data/form-control';
import {
  component,
  designation,
  selectDetails,
} from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-single-value-select',
  imports: [Select2Module, Card],
  templateUrl: './single-value-select.html',
  styleUrl: './single-value-select.scss',
})
export class SingleValueSelect {
  public selectTheme = selectTheme;
  public designation = designation;
  public component = component;
  public selectDetails = selectDetails;
}
