import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { inverseTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-inverse-table',
  imports: [Card],
  templateUrl: './inverse-table.html',
  styleUrl: './inverse-table.scss',
})
export class InverseTable {
  public inverseTable = inverseTable;
}
