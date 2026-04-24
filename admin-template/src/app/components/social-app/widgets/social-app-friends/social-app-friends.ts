import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { users } from '../../../../shared/data/user';

@Component({
  selector: 'app-social-app-friends',
  imports: [RouterModule, Card, SvgIcon],
  templateUrl: './social-app-friends.html',
  styleUrl: './social-app-friends.scss',
})
export class SocialAppFriends {
  public users = users;
}
