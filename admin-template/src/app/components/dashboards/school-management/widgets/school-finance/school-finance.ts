import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { schoolFinance } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-school-finance',
  imports: [NgApexchartsModule, Card],
  templateUrl: './school-finance.html',
  styleUrl: './school-finance.scss',
})
export class SchoolFinance {
  public schoolFinance = schoolFinance;
  public cardToggleOption = cardToggleOptions3;
}
