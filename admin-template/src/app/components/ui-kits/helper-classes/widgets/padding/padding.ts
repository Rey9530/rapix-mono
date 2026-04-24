import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { values } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-padding',
  imports: [Card],
  templateUrl: './padding.html',
  styleUrl: './padding.scss',
})
export class Padding {
  public paddings = values;
}
