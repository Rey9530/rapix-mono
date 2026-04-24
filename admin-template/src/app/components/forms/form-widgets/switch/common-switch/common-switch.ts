import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { commonSwitch } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-common-switch',
  imports: [Card],
  templateUrl: './common-switch.html',
  styleUrl: './common-switch.scss',
})
export class CommonSwitch {
  public commonSwitch = commonSwitch;
}
