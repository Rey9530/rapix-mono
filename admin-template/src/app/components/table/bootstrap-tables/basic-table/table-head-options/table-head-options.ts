import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { tableHeadOption } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-table-head-options',
  imports: [Card],
  templateUrl: './table-head-options.html',
  styleUrl: './table-head-options.scss',
})
export class TableHeadOptions {
  public tableHeadOption = tableHeadOption;
}
