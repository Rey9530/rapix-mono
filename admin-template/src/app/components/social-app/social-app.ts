import { Component } from '@angular/core';

import { SocialAppAbout } from './widgets/social-app-about/social-app-about';
import { SocialAppFriends } from './widgets/social-app-friends/social-app-friends';
import { SocialAppPhotos } from './widgets/social-app-photos/social-app-photos';
import { SocialAppProfile } from './widgets/social-app-profile/social-app-profile';
import { SocialAppTimeline } from './widgets/social-app-timeline/social-app-timeline';

@Component({
  selector: 'app-social-app',
  imports: [
    SocialAppProfile,
    SocialAppTimeline,
    SocialAppAbout,
    SocialAppFriends,
    SocialAppPhotos,
  ],
  templateUrl: './social-app.html',
  styleUrl: './social-app.scss',
})
export class SocialApp {
  public activeTab: string;

  handleCurrentTab(value: string) {
    this.activeTab = value;
  }
}
