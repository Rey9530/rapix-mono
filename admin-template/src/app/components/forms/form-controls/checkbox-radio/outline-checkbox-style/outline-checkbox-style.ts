import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { outlineCheckbox } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-outline-checkbox-style',
  imports: [Card],
  templateUrl: './outline-checkbox-style.html',
  styleUrl: './outline-checkbox-style.scss',
})
export class OutlineCheckboxStyle {
  public outlineCheckbox = outlineCheckbox;
}
