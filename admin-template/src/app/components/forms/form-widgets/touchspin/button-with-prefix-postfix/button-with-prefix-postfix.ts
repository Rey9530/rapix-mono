import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-button-with-prefix-postfix',
  imports: [Card],
  templateUrl: './button-with-prefix-postfix.html',
  styleUrl: './button-with-prefix-postfix.scss',
})
export class ButtonWithPrefixPostfix {
  public counter: number[] = [0, 0];

  increment(i: number) {
    if (i == 0 || i == 1) {
      this.counter[i] += 1;
    }
  }

  decrement(i: number) {
    if (i == 0 || i == 1) {
      if (this.counter[i] > 0) {
        this.counter[i] -= 1;
      }
    }
  }
}
