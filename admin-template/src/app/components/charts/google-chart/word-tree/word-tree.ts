import { Component } from '@angular/core';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { Card } from '../../../../shared/components/ui/card/card';
import { wordTreeChart } from '../../../../shared/data/charts/google-chart';

@Component({
  selector: 'app-word-tree',
  imports: [Ng2GoogleChartsModule, Card],
  templateUrl: './word-tree.html',
  styleUrl: './word-tree.scss',
})
export class WordTree {
  public wordTreeChart = wordTreeChart;
}
