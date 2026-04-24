import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { basicTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-basic-table-with-border-bottom-color',
  imports: [Card],
  templateUrl: './basic-table-with-border-bottom-color.html',
  styleUrl: './basic-table-with-border-bottom-color.scss',
})
export class BasicTableWithBorderBottomColor {
  public basicTable = basicTable;
}
