import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { ratioAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-ratio',
  imports: [Card],
  templateUrl: './avatar-ratio.html',
  styleUrl: './avatar-ratio.scss',
})
export class AvatarRatio {
  public ratioAvatar = ratioAvatar;
}
