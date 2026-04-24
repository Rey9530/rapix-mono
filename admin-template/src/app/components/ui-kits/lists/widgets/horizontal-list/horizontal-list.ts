import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-horizontal-list',
  imports: [Card],
  templateUrl: './horizontal-list.html',
  styleUrl: './horizontal-list.scss',
})
export class HorizontalList {
  public horizontalList = horizontalList;
}
