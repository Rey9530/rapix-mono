import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { groupAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-grouping',
  imports: [Card],
  templateUrl: './avatar-grouping.html',
  styleUrl: './avatar-grouping.scss',
})
export class AvatarGrouping {
  public groupAvatar = groupAvatar;
}
