import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { sessionByCountries } from '../../../../../shared/data/dashboard/analytics';

@Component({
  selector: 'app-session-by-countries',
  imports: [NgApexchartsModule, Card],
  templateUrl: './session-by-countries.html',
  styleUrl: './session-by-countries.scss',
})
export class SessionByCountries {
  public sessionByCountries = sessionByCountries;
  public cardToggleOption = cardToggleOptions3;
}
