import { Component, input } from '@angular/core';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { faqDetails } from '../../../../shared/data/faq';

@Component({
  selector: 'app-common-faq-details',
  imports: [FeatherIcon],
  templateUrl: './common-faq-details.html',
  styleUrl: './common-faq-details.scss',
})
export class CommonFaqDetails {
  readonly details = input(faqDetails);
}
