import { Component } from '@angular/core';

import { Card } from '../../shared/components/ui/card/card';
import { Table } from '../../shared/components/ui/table/table';
import { subscribedUser } from '../../shared/data/subscribed-user';
import { ITableConfigs } from '../../shared/interface/common';
import { ISubscribedUser } from '../../shared/interface/subscribed-user';

@Component({
  selector: 'app-subscribed-user',
  imports: [Table, Card],
  templateUrl: './subscribed-user.html',
  styleUrl: './subscribed-user.scss',
})
export class SubscribedUser {
  public subscribedUser = subscribedUser;

  public tableConfig: ITableConfigs<ISubscribedUser> = {
    columns: [
      { title: 'Email ID', field_value: 'email_id', sort: true },
      {
        title: 'Subscription Date',
        field_value: 'subscription_date',
        sort: true,
      },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [
      { label: 'Refresh', action_to_perform: 'refresh', icon: 'arrows-rotate' },
    ],
    data: [] as ISubscribedUser[],
  };

  ngOnInit() {
    this.tableConfig.data = subscribedUser.map((user: ISubscribedUser) => {
      const formattedUsers = { ...user };
      formattedUsers.status = `<span class="badge badge-light-${user.class}">${user.status}</span>`;
      return formattedUsers;
    });
  }
}
