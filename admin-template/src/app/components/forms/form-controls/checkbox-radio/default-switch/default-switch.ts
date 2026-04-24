import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { defaultSwitch } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-default-switch',
  imports: [Card],
  templateUrl: './default-switch.html',
  styleUrl: './default-switch.scss',
})
export class DefaultSwitch {
  public defaultSwitch = defaultSwitch;
}
