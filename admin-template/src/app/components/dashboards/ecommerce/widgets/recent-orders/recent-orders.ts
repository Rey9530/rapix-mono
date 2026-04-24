import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  categories,
  recentOrders,
} from '../../../../../shared/data/dashboard/e-commerce';
import {
  ICategories,
  IRecentOrders,
} from '../../../../../shared/interface/dashboard/e-commerce';

@Component({
  selector: 'app-recent-orders',
  imports: [RouterModule, NgbTooltipModule, Card, DecimalPipe],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.scss',
})
export class RecentOrders {
  public categories = categories;
  public recentOrders = recentOrders;
  public activeCategory: string = 'furniture';
  public filteredOrders: IRecentOrders[];

  ngOnInit() {
    if (this.activeCategory) {
      this.filteredOrders = this.recentOrders.filter((order) => {
        return order.category === this.activeCategory;
      });
    }
  }

  changeCategory(category: ICategories) {
    this.activeCategory = category.value;

    this.filteredOrders = this.recentOrders.filter((order) => {
      return order.category === this.activeCategory;
    });
  }
}
