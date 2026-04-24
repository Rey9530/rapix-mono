import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { statusIndicatorAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-status-indicator',
  imports: [Card, NgClass],
  templateUrl: './avatar-status-indicator.html',
  styleUrl: './avatar-status-indicator.scss',
})
export class AvatarStatusIndicator {
  public statusIndicatorAvatar = statusIndicatorAvatar;
}
