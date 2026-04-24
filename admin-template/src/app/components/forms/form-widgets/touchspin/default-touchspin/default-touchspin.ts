import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { touchSpinDetails } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-default-touchspin',
  imports: [Card],
  templateUrl: './default-touchspin.html',
  styleUrl: './default-touchspin.scss',
})
export class DefaultTouchspin {
  public touchSpinDetails = touchSpinDetails;

  changeValue(id: number, value: number) {
    this.touchSpinDetails.filter((details) => {
      if (details.id == id) {
        if (value == -1) {
          if (details.default_value >= 1) {
            details.default_value -= 1;
          }
        } else if (value == 1) {
          details.default_value += 1;
        }
      }
    });
  }
}
