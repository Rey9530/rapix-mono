import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  basicCheckbox,
  simpleRadio,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-basic-radio-checkbox',
  imports: [Card],
  templateUrl: './basic-radio-checkbox.html',
  styleUrl: './basic-radio-checkbox.scss',
})
export class BasicRadioCheckbox {
  public basicCheckbox = basicCheckbox;
  public simpleRadio = simpleRadio;
}
