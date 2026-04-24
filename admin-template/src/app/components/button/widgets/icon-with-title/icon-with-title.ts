import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { iconTitle } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-icon-with-title',
  imports: [Card, FeatherIcon],
  templateUrl: './icon-with-title.html',
  styleUrl: './icon-with-title.scss',
})
export class IconWithTitle {
  public iconTitle = iconTitle;
}
