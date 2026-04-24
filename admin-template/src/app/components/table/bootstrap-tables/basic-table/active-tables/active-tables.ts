import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { activeTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-active-tables',
  imports: [Card],
  templateUrl: './active-tables.html',
  styleUrl: './active-tables.scss',
})
export class ActiveTables {
  public activeTable = activeTable;
}
