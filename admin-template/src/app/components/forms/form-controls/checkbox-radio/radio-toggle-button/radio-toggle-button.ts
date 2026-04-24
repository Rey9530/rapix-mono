import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { radioToggle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-radio-toggle-button',
  imports: [Card],
  templateUrl: './radio-toggle-button.html',
  styleUrl: './radio-toggle-button.scss',
})
export class RadioToggleButton {
  public radioToggle = radioToggle;
}
