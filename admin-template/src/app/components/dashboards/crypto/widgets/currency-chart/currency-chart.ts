import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { ICurrencyChart } from '../../../../../shared/interface/dashboard/crypto';

@Component({
  selector: 'app-currency-chart',
  imports: [NgApexchartsModule, Card, SvgIcon, FeatherIcon, DecimalPipe],
  templateUrl: './currency-chart.html',
  styleUrl: './currency-chart.scss',
})
export class CurrencyChart {
  readonly chart = input<ICurrencyChart>();
}
