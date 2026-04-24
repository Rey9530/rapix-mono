import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { badgeIndicatorAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-badge',
  imports: [Card, NgClass],
  templateUrl: './avatar-badge.html',
  styleUrl: './avatar-badge.scss',
})
export class AvatarBadge {
  public badgeIndicatorAvatar = badgeIndicatorAvatar;
}
