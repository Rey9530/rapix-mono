import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { numberList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-list-number',
  imports: [Card],
  templateUrl: './list-number.html',
  styleUrl: './list-number.scss',
})
export class ListNumber {
  public numberList = numberList;
}
