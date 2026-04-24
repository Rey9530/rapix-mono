import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { tableFoot } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-table-foot',
  imports: [Card],
  templateUrl: './table-foot.html',
  styleUrl: './table-foot.scss',
})
export class TableFoot {
  public tableFoot = tableFoot;
}
