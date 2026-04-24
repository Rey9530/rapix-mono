import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { radioList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-list-radio',
  imports: [Card],
  templateUrl: './list-radio.html',
  styleUrl: './list-radio.scss',
})
export class ListRadio {
  public radioList = radioList;
}
