import { Component } from '@angular/core';

import { Card } from '../../shared/components/ui/card/card';
import { becomeMember, simplePricingCard } from '../../shared/data/pricing';

@Component({
  selector: 'app-pricing',
  imports: [Card],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  public becomeMember = becomeMember;
  public simplePricingCard = simplePricingCard;
}
