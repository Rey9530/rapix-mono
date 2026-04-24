import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { turnOverChart } from '../../../../../shared/data/widgets/chart';

@Component({
  selector: 'app-turn-over',
  imports: [NgApexchartsModule, Card],
  templateUrl: './turn-over.html',
  styleUrl: './turn-over.scss',
})
export class TurnOver {
  public turnOverChart = turnOverChart;
}
