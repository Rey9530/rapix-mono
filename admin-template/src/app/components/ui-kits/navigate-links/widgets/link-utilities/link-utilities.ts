import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { colorsTwo } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-link-utilities',
  imports: [Card],
  templateUrl: './link-utilities.html',
  styleUrl: './link-utilities.scss',
})
export class LinkUtilities {
  public colors = colorsTwo;
}
