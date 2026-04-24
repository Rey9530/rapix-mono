import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { switchSizing } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-switch-sizing',
  imports: [Card],
  templateUrl: './switch-sizing.html',
  styleUrl: './switch-sizing.scss',
})
export class SwitchSizing {
  public switchSizing = switchSizing;
}
