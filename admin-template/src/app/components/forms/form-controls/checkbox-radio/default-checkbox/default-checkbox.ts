import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { defaultCheckbox } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-default-checkbox',
  imports: [Card],
  templateUrl: './default-checkbox.html',
  styleUrl: './default-checkbox.scss',
})
export class DefaultCheckbox {
  public defaultCheckbox = defaultCheckbox;
}
