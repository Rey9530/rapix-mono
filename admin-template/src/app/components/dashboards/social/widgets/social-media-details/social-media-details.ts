import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { ISocialMediaDetails } from '../../../../../shared/interface/dashboard/social';

@Component({
  selector: 'app-social-media-details',
  imports: [NgApexchartsModule, Card, DecimalPipe],
  templateUrl: './social-media-details.html',
  styleUrl: './social-media-details.scss',
})
export class SocialMediaDetails {
  readonly details = input<ISocialMediaDetails>();
}
