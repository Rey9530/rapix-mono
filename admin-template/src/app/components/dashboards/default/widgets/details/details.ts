import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { IDetails } from '../../../../../shared/interface/dashboard/default';

@Component({
  selector: 'app-details',
  imports: [Card, SvgIcon, FeatherIcon],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  readonly detail = input<IDetails>();
}
