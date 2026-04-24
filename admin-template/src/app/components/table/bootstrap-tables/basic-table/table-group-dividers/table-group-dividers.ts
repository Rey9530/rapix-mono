import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { tableGroupDividers } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-table-group-dividers',
  imports: [Card],
  templateUrl: './table-group-dividers.html',
  styleUrl: './table-group-dividers.scss',
})
export class TableGroupDividers {
  public tableGroupDividers = tableGroupDividers;
}
