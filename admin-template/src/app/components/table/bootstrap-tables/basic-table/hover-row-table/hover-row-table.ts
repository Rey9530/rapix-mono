import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { hoverAbleTable } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-hover-row-table',
  imports: [Card, FeatherIcon],
  templateUrl: './hover-row-table.html',
  styleUrl: './hover-row-table.scss',
})
export class HoverRowTable {
  public hoverAbleTable = hoverAbleTable;
}
