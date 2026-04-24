import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';
import { users } from '../../../shared/data/user';

@Component({
  selector: 'app-user-cards',
  imports: [RouterModule, Card, SvgIcon],
  templateUrl: './user-cards.html',
  styleUrl: './user-cards.scss',
})
export class UserCards {
  public users = users;
}
