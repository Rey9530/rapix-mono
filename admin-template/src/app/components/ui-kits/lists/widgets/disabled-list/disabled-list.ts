import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { DisabledLists } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-disabled-list',
  imports: [Card],
  templateUrl: './disabled-list.html',
  styleUrl: './disabled-list.scss',
})
export class DisabledList {
  public DisabledLists = DisabledLists;
}
