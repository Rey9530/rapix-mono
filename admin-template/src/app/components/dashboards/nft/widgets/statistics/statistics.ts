import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { statistics } from '../../../../../shared/data/dashboard/nft';

@Component({
  selector: 'app-statistics',
  imports: [NgApexchartsModule, Card, DecimalPipe],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  public statistics = statistics;
}
