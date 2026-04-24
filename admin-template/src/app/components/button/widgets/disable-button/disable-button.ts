import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { disableButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-disable-button',
  imports: [Card],
  templateUrl: './disable-button.html',
  styleUrl: './disable-button.scss',
})
export class DisableButton {
  public disableButton = disableButton;
}
