import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../shared/components/ui/card/card';
import { userDetailsTab, users } from '../../../shared/data/user';
import { IUsers } from '../../../shared/interface/user';
import { UserActivity } from '../widgets/user-activity/user-activity';
import { UserNotification } from '../widgets/user-notification/user-notification';
import { UserPersonalDetails } from '../widgets/user-personal-details/user-personal-details';
import { UserSetting } from '../widgets/user-setting/user-setting';
import { UserTask } from '../widgets/user-task/user-task';

@Component({
  selector: 'app-user-profile',
  imports: [
    NgbNavModule,
    UserPersonalDetails,
    Card,
    UserActivity,
    UserTask,
    UserNotification,
    UserSetting,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  private route = inject(ActivatedRoute);

  public currentUserId: number;
  public currentUser: IUsers;
  public activeTab: string = 'activity';

  public users = users;
  public userDetailsTab = userDetailsTab;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.currentUserId = id;
        const user = this.users.find((user) => user.id === this.currentUserId);
        if (user) {
          this.currentUser = user;
        }
      }
    });
  }
}
