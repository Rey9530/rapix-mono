import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { userPost } from '../../../../shared/data/social-app';
import { SocialAppLeftPanel } from '../social-app-left-panel/social-app-left-panel';
import { SocialAppRightPanel } from '../social-app-right-panel/social-app-right-panel';

@Component({
  selector: 'app-social-app-timeline',
  imports: [SocialAppLeftPanel, SocialAppRightPanel, FeatherIcon, NgClass],
  templateUrl: './social-app-timeline.html',
  styleUrl: './social-app-timeline.scss',
})
export class SocialAppTimeline {
  public userPost = userPost;
}
