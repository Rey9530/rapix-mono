import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { switchIcon } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-switch-with-icons',
  imports: [Card],
  templateUrl: './switch-with-icons.html',
  styleUrl: './switch-with-icons.scss',
})
export class SwitchWithIcons {
  public switchIcon = switchIcon;
}
