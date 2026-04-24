import { Component } from '@angular/core';

import { AvatarAnimated } from './widgets/avatar-animated/avatar-animated';
import { AvatarBadge } from './widgets/avatar-badge/avatar-badge';
import { AvatarGrouping } from './widgets/avatar-grouping/avatar-grouping';
import { AvatarLatter } from './widgets/avatar-latter/avatar-latter';
import { AvatarRatio } from './widgets/avatar-ratio/avatar-ratio';
import { AvatarShape } from './widgets/avatar-shape/avatar-shape';
import { AvatarSize } from './widgets/avatar-size/avatar-size';
import { AvatarStatusIndicator } from './widgets/avatar-status-indicator/avatar-status-indicator';

@Component({
  selector: 'app-avatars',
  imports: [
    AvatarSize,
    AvatarStatusIndicator,
    AvatarShape,
    AvatarRatio,
    AvatarGrouping,
    AvatarBadge,
    AvatarLatter,
    AvatarAnimated,
  ],
  templateUrl: './avatars.html',
  styleUrl: './avatars.scss',
})
export class Avatars {}
