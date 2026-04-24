import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { IActivityPanel } from '../../../../../shared/interface/dashboard/nft';

@Component({
  selector: 'app-activity-panel',
  imports: [Card, FeatherIcon],
  templateUrl: './activity-panel.html',
  styleUrl: './activity-panel.scss',
})
export class ActivityPanel {
  readonly activity = input<IActivityPanel>();
}
