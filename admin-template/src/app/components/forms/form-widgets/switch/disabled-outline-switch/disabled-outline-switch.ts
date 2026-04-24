import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { disabledOutlineSwitch } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-disabled-outline-switch',
  imports: [Card],
  templateUrl: './disabled-outline-switch.html',
  styleUrl: './disabled-outline-switch.scss',
})
export class DisabledOutlineSwitch {
  public disabledOutlineSwitch = disabledOutlineSwitch;
}
