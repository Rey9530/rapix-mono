import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { tableWithoutBorder } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-table-without-borders',
  imports: [Card],
  templateUrl: './table-without-borders.html',
  styleUrl: './table-without-borders.scss',
})
export class TableWithoutBorders {
  public tableWithoutBorder = tableWithoutBorder;
}
