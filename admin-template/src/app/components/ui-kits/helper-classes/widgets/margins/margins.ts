import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { values } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-margins',
  imports: [Card],
  templateUrl: './margins.html',
  styleUrl: './margins.scss',
})
export class Margins {
  public margins = values;
}
