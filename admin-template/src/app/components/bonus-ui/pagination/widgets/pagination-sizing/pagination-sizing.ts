import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { paginationSizing } from '../../../../../shared/data/bonus-ui/pagination';

@Component({
  selector: 'app-pagination-sizing',
  imports: [Card],
  templateUrl: './pagination-sizing.html',
  styleUrl: './pagination-sizing.scss',
})
export class PaginationSizing {
  public paginationSizing = paginationSizing;
}
