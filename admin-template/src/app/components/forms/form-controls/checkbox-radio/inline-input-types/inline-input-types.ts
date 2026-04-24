import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  inlineCheckbox,
  inlineRadio,
  inlineSwitch,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-inline-input-types',
  imports: [Card],
  templateUrl: './inline-input-types.html',
  styleUrl: './inline-input-types.scss',
})
export class InlineInputTypes {
  public inlineCheckbox = inlineCheckbox;
  public inlineRadio = inlineRadio;
  public inlineSwitch = inlineSwitch;
}
