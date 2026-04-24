import { Component } from '@angular/core';

import { DefaultPagination } from './widgets/default-pagination/default-pagination';
import { PaginationActiveDisable } from './widgets/pagination-active-disable/pagination-active-disable';
import { PaginationAlignment } from './widgets/pagination-alignment/pagination-alignment';
import { PaginationIcon } from './widgets/pagination-icon/pagination-icon';
import { PaginationSizing } from './widgets/pagination-sizing/pagination-sizing';
import { RoundedPagination } from './widgets/rounded-pagination/rounded-pagination';

@Component({
  selector: 'app-pagination',
  imports: [
    DefaultPagination,
    PaginationActiveDisable,
    PaginationIcon,
    RoundedPagination,
    PaginationAlignment,
    PaginationSizing,
  ],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {}
