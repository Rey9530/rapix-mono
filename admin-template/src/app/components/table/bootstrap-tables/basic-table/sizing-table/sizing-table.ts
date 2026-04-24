import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { sizingTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-sizing-table',
  imports: [Card],
  templateUrl: './sizing-table.html',
  styleUrl: './sizing-table.scss',
})
export class SizingTable {
  public sizingTable = sizingTable;
}
