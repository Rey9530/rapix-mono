import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions6 } from '../../../../../shared/data/common';
import { marketGraph } from '../../../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-market-graph',
  imports: [NgApexchartsModule, Card],
  templateUrl: './market-graph.html',
  styleUrl: './market-graph.scss',
})
export class MarketGraph {
  public marketGraph = marketGraph;
  public cardToggleOption = cardToggleOptions6;
}
