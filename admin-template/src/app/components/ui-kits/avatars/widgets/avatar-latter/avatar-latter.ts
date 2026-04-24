import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { letterAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-latter',
  imports: [Card],
  templateUrl: './avatar-latter.html',
  styleUrl: './avatar-latter.scss',
})
export class AvatarLatter {
  public letterAvatar = letterAvatar;
}
