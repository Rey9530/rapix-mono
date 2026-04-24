import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';

import { totalSalesChart } from '../../../../../shared/data/dashboard/crm';

@Component({
  selector: 'app-total-sales',
  imports: [NgApexchartsModule, RouterModule, NgClass],
  templateUrl: './total-sales.html',
  styleUrl: './total-sales.scss',
})
export class TotalSales {
  public totalSalesChart = totalSalesChart;
}
