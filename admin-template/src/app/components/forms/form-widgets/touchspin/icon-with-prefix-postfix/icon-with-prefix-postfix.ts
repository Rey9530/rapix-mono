import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-icon-with-prefix-postfix',
  imports: [Card],
  templateUrl: './icon-with-prefix-postfix.html',
  styleUrl: './icon-with-prefix-postfix.scss',
})
export class IconWithPrefixPostfix {
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
