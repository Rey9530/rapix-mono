import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { checkboxList } from '../../../../../shared/data/ui-kits/lists';

@Component({
  selector: 'app-list-checkbox',
  imports: [Card],
  templateUrl: './list-checkbox.html',
  styleUrl: './list-checkbox.scss',
})
export class ListCheckbox {
  public checkboxList = checkboxList;
}
