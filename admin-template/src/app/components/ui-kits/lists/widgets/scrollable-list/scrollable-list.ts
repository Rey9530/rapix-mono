import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { scrollableList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-scrollable-list',
  imports: [Card],
  templateUrl: './scrollable-list.html',
  styleUrl: './scrollable-list.scss',
})
export class ScrollableList {
  public scrollableList = scrollableList;
}
