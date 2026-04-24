import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { shapeAvatar } from '../../../../../shared/data/ui-kits/avatars';

@Component({
  selector: 'app-avatar-shape',
  imports: [Card],
  templateUrl: './avatar-shape.html',
  styleUrl: './avatar-shape.scss',
})
export class AvatarShape {
  public shapeAvatar = shapeAvatar;
}
