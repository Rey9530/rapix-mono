import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { customTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-custom-table-color',
  imports: [Card],
  templateUrl: './custom-table-color.html',
  styleUrl: './custom-table-color.scss',
})
export class CustomTableColor {
  public customTable = customTable;
}
