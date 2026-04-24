import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { checkboxButton, radioButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-radio-checkbox-animated-button',
  imports: [Card],
  templateUrl: './radio-checkbox-animated-button.html',
  styleUrl: './radio-checkbox-animated-button.scss',
})
export class RadioCheckboxAnimatedButton {
  public radioButton = radioButton;
  public checkboxButton = checkboxButton;
}
