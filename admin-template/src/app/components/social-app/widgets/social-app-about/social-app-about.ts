import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { friends, myProfile } from '../../../../shared/data/social-app';
import { IActivityLog } from '../../../../shared/interface/dashboard/social';
import { SocialAppLeftPanel } from '../social-app-left-panel/social-app-left-panel';
import { SocialAppRightPanel } from '../social-app-right-panel/social-app-right-panel';

@Component({
  selector: 'app-social-app-about',
  imports: [
    SlicePipe,
    SocialAppLeftPanel,
    SocialAppRightPanel,
    Card,
    FeatherIcon,
  ],
  templateUrl: './social-app-about.html',
  styleUrl: './social-app-about.scss',
})
export class SocialAppAbout {
  public friends = friends;
  public myProfile = myProfile;

  objectKeys(obj: Record<string, IActivityLog[]>): string[] {
    return Object.keys(obj);
  }

  getActivityGroup(): Record<string, IActivityLog[]> {
    const groups: Record<string, IActivityLog[]> = {};

    this.myProfile.activity_log.forEach((activity) => {
      if (!groups[activity.date]) {
        groups[activity.date] = [];
      }

      groups[activity.date].push(activity);
    });

    return groups;
  }

  getDate(date: string) {
    let todayDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });

    let newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);

    let yesterdayDate = newDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
    if (date == todayDate) {
      return 'Today';
    } else if (date == yesterdayDate) {
      return 'Yesterday';
    } else {
      return date;
    }
  }
}
