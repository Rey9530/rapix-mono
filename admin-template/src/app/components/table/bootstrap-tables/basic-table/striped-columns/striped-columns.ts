import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { stripedColumn } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-striped-columns',
  imports: [Card],
  templateUrl: './striped-columns.html',
  styleUrl: './striped-columns.scss',
})
export class StripedColumns {
  public stripedColumn = stripedColumn;
}
