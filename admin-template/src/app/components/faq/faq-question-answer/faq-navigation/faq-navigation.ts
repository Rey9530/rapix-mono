import { Component } from '@angular/core';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { navigation } from '../../../../shared/data/faq';

@Component({
  selector: 'app-faq-navigation',
  imports: [FeatherIcon],
  templateUrl: './faq-navigation.html',
  styleUrl: './faq-navigation.scss',
})
export class FaqNavigation {
  public navigation = navigation;
}
