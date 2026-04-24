import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { myPortfolio } from '../../../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-my-portfolio',
  imports: [NgApexchartsModule, Card, SvgIcon, NgClass],
  templateUrl: './my-portfolio.html',
  styleUrl: './my-portfolio.scss',
})
export class MyPortfolio {
  public myPortfolio = myPortfolio;
}
