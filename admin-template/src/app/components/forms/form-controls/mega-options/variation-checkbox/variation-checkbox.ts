import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { checkBox, themeSales } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-variation-checkbox',
  imports: [Card],
  templateUrl: './variation-checkbox.html',
  styleUrl: './variation-checkbox.scss',
})
export class VariationCheckbox {
  public checkBox = checkBox;
  public themeSales = themeSales;
}
