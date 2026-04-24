import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { numberBadgeList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-number-badge-list',
  imports: [Card],
  templateUrl: './number-badge-list.html',
  styleUrl: './number-badge-list.scss',
})
export class NumberBadgeList {
  public numberBadgeList = numberBadgeList;
}
