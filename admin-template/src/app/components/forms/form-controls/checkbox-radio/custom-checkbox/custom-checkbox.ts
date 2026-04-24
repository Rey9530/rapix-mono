import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  borderCheckbox,
  filledCheckbox,
  iconsCheckbox,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-custom-checkbox',
  imports: [Card],
  templateUrl: './custom-checkbox.html',
  styleUrl: './custom-checkbox.scss',
})
export class CustomCheckbox {
  public borderCheckbox = borderCheckbox;
  public iconCheckbox = iconsCheckbox;
  public filledCheckbox = filledCheckbox;
}
