import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { dashedBorderTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-dashed-border',
  imports: [Card],
  templateUrl: './dashed-border.html',
  styleUrl: './dashed-border.scss',
})
export class DashedBorder {
  public dashedBorderTable = dashedBorderTable;
}
