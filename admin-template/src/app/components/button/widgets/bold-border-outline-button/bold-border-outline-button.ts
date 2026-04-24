import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { boldBorder } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-bold-border-outline-button',
  imports: [Card],
  templateUrl: './bold-border-outline-button.html',
  styleUrl: './bold-border-outline-button.scss',
})
export class BoldBorderOutlineButton {
  public boldBorder = boldBorder;
}
