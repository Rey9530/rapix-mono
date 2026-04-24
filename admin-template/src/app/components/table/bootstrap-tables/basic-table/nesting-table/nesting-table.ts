import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { nestingTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-nesting-table',
  imports: [Card],
  templateUrl: './nesting-table.html',
  styleUrl: './nesting-table.scss',
})
export class NestingTable {
  public nestingTable = nestingTable;
}
