import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { stripedRow } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-striped-row-with-inverse-table',
  imports: [Card],
  templateUrl: './striped-row-with-inverse-table.html',
  styleUrl: './striped-row-with-inverse-table.scss',
})
export class StripedRowWithInverseTable {
  public stripedRow = stripedRow;
}
