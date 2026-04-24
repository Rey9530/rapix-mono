import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { touchSpinDetails } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-rounded-touchspin',
  imports: [Card],
  templateUrl: './rounded-touchspin.html',
  styleUrl: './rounded-touchspin.scss',
})
export class RoundedTouchspin {
  public touchSpinDetails = touchSpinDetails;

  changeValue(id: number, value: number) {
    this.touchSpinDetails.filter((details) => {
      if (details.id == id) {
        if (value == -1) {
          if (details.rounded_value >= 1) {
            details.rounded_value -= 1;
          }
        } else if (value == 1) {
          details.rounded_value += 1;
        }
      }
    });
  }
}
