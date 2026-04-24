import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { profitByCountry } from '../../../../../shared/data/dashboard/logistics';

@Component({
  selector: 'app-profit-by-country',
  imports: [NgApexchartsModule, Card],
  templateUrl: './profit-by-country.html',
  styleUrl: './profit-by-country.scss',
})
export class ProfitByCountry {
  public cardToggleOption = cardToggleOptions3;
  public profitByCountry = profitByCountry;
}
