import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { paginationAlignment } from '../../../../../shared/data/bonus-ui/pagination';

@Component({
  selector: 'app-pagination-alignment',
  imports: [Card],
  templateUrl: './pagination-alignment.html',
  styleUrl: './pagination-alignment.scss',
})
export class PaginationAlignment {
  public paginationAlignment = paginationAlignment;
}
