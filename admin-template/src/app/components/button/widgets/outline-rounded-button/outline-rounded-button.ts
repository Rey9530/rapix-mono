import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { roundedButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-outline-rounded-button',
  imports: [Card],
  templateUrl: './outline-rounded-button.html',
  styleUrl: './outline-rounded-button.scss',
})
export class OutlineRoundedButton {
  public roundedButton = roundedButton;
}
