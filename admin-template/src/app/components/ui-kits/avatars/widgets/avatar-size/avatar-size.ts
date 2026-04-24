import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { sizeAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-size',
  imports: [Card, NgClass],
  templateUrl: './avatar-size.html',
  styleUrl: './avatar-size.scss',
})
export class AvatarSize {
  public sizeAvatar = sizeAvatar;
}
