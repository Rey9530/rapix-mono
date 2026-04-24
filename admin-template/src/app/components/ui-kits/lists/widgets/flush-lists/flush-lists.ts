import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { flushList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-flush-lists',
  imports: [Card],
  templateUrl: './flush-lists.html',
  styleUrl: './flush-lists.scss',
})
export class FlushLists {
  public flushList = flushList;
}
