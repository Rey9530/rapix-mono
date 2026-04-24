import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { responsiveTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-responsive-table',
  imports: [Card],
  templateUrl: './responsive-table.html',
  styleUrl: './responsive-table.scss',
})
export class ResponsiveTable {
  public responsiveTable = responsiveTable;
}
