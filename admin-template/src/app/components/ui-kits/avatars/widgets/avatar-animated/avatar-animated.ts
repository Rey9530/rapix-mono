import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { animatedAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-animated',
  imports: [Card, NgClass],
  templateUrl: './avatar-animated.html',
  styleUrl: './avatar-animated.scss',
})
export class AvatarAnimated {
  public animatedAvatar = animatedAvatar;
}
