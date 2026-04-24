import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { offerStyleBorder } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-offer-style-border',
  imports: [Card],
  templateUrl: './offer-style-border.html',
  styleUrl: './offer-style-border.scss',
})
export class OfferStyleBorder {
  public offerStyleBorder = offerStyleBorder;
}
