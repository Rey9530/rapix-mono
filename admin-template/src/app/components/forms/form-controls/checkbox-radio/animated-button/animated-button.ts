import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  paymentDetails,
  socialMedia,
} from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-animated-button',
  imports: [Card],
  templateUrl: './animated-button.html',
  styleUrl: './animated-button.scss',
})
export class AnimatedButton {
  public paymentDetails = paymentDetails;
  public socialMedia = socialMedia;
}
