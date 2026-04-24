import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { roundedButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-rounded-button',
  imports: [Card],
  templateUrl: './rounded-button.html',
  styleUrl: './rounded-button.scss',
})
export class RoundedButton {
  public roundedButton = roundedButton;
}
