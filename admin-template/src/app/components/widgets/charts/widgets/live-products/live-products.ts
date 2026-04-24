import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { liveProductChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-live-products',
  imports: [NgApexchartsModule, Card],
  templateUrl: './live-products.html',
  styleUrl: './live-products.scss',
})
export class LiveProducts {
  public liveProductChart = liveProductChart;
}
