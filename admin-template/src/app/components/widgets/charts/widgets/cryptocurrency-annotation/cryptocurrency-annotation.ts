import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cryptoAnnotationChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-cryptocurrency-annotation',
  imports: [NgApexchartsModule, Card],
  templateUrl: './cryptocurrency-annotation.html',
  styleUrl: './cryptocurrency-annotation.scss',
})
export class CryptocurrencyAnnotation {
  public cryptoAnnotationChart = cryptoAnnotationChart;
}
