import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { defaultList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-default-lists',
  imports: [Card],
  templateUrl: './default-lists.html',
  styleUrl: './default-lists.scss',
})
export class DefaultLists {
  public defaultList = defaultList;
}
