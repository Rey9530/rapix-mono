import { Component, input } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { IStoreGeneralDetails } from '../../../../shared/interface/store';

@Component({
  selector: 'app-store-general-details',
  imports: [Card, SvgIcon],
  templateUrl: './store-general-details.html',
  styleUrl: './store-general-details.scss',
})
export class StoreGeneralDetails {
  readonly details = input<IStoreGeneralDetails>();
}
