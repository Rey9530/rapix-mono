import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { customSwitch } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-custom-switch',
  imports: [Card],
  templateUrl: './custom-switch.html',
  styleUrl: './custom-switch.scss',
})
export class CustomSwitch {
  public customSwitch = customSwitch;
}
