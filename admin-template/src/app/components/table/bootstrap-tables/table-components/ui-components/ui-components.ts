import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-ui-components',
  imports: [Card],
  templateUrl: './ui-components.html',
  styleUrl: './ui-components.scss',
})
export class UiComponents {
  public open: boolean = false;

  openMenu() {
    this.open = !this.open;
  }
}
