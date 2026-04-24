import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { tableBorder } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-table-borders',
  imports: [Card],
  templateUrl: './table-borders.html',
  styleUrl: './table-borders.scss',
})
export class TableBorders {
  public tableBorder = tableBorder;
}
