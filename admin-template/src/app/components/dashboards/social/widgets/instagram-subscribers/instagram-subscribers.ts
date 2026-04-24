import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { instagramSubscribers } from '../../../../../shared/data/dashboard/social';

@Component({
  selector: 'app-instagram-subscribers',
  imports: [NgApexchartsModule, Card],
  templateUrl: './instagram-subscribers.html',
  styleUrl: './instagram-subscribers.scss',
})
export class InstagramSubscribers {
  public cardToggleOption = cardToggleOptions3;
  public instagramSubscribers = instagramSubscribers;
}
