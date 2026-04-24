import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { facebookCampaign } from '../../../../../shared/data/dashboard/social';

@Component({
  selector: 'app-facebook-campaign',
  imports: [Card, DecimalPipe, SlicePipe],
  templateUrl: './facebook-campaign.html',
  styleUrl: './facebook-campaign.scss',
})
export class FacebookCampaign {
  public facebookCampaign = facebookCampaign;
  public showImage: number = 5;
}
