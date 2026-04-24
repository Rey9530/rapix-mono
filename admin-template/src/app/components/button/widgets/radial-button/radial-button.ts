import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { radialButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-radial-button',
  imports: [Card],
  templateUrl: './radial-button.html',
  styleUrl: './radial-button.scss',
})
export class RadialButton {
  public radialButton = radialButton;
}
