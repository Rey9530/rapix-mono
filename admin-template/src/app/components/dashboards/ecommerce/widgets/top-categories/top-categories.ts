import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { topCategories } from '../../../../../shared/data/dashboard/e-commerce';

@Component({
  selector: 'app-top-categories',
  imports: [RouterModule, DecimalPipe],
  templateUrl: './top-categories.html',
  styleUrl: './top-categories.scss',
})
export class TopCategories {
  public topCategories = topCategories;
}
