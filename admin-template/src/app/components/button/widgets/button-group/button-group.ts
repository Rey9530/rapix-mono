import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { buttonGroups } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-button-group',
  imports: [Card, FeatherIcon],
  templateUrl: './button-group.html',
  styleUrl: './button-group.scss',
})
export class ButtonGroup {
  public buttonGroups = buttonGroups;
}
