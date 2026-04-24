import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { touchSpinDetails } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-outline-touchspin',
  imports: [Card],
  templateUrl: './outline-touchspin.html',
  styleUrl: './outline-touchspin.scss',
})
export class OutlineTouchspin {
  public touchSpinDetails = touchSpinDetails;

  changeValue(id: number, value: number) {
    this.touchSpinDetails.filter((details) => {
      if (details.id == id) {
        if (value == -1) {
          if (details.outlined_value >= 1) {
            details.outlined_value -= 1;
          }
        } else if (value == 1) {
          details.outlined_value += 1;
        }
      }
    });
  }
}
