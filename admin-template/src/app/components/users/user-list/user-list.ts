import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

import { Table } from '../../../shared/components/ui/table/table';
import { users } from '../../../shared/data/user';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../../shared/interface/common';
import { IUsers } from '../../../shared/interface/user';

@Component({
  selector: 'app-user-list',
  imports: [RouterModule, Table],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public users: IUsers[];
  public tableConfig: ITableConfigs<IUsers> = {
    columns: [
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'Email', field_value: 'email', sort: true },
      { title: 'Role', field_value: 'role', sort: true },
      { title: 'Creation Date', field_value: 'creation_date', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [
      {
        label: 'Edit',
        action_to_perform: 'edit',
        icon: 'edit-content',
        path: '/user/add-user',
      },
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: true,
        model_text: 'Do you really want to delete the user?',
      },
    ],
    data: [] as IUsers[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-profile/1']);
    };

    this.users = users;
    this.tableConfig.data = this.formatUserDetails(users);
  }

  handleAction(value: ITableClickedAction<IUsers>) {
    if (value.action_to_perform === 'delete' && value.data) {
      this.users = this.users.filter(
        (user: IUsers) => user.id !== value.data!.id,
      );
      this.tableConfig = {
        ...this.tableConfig,
        data: this.formatUserDetails(this.users),
      };
    }
  }

  private formatUserDetails(users: IUsers[]) {
    return users.map((user: IUsers) => {
      const formattedProducts = { ...user };
      formattedProducts.name = this.sanitizer.bypassSecurityTrustHtml(
        `<a href="javascript:void(0)" onclick="navigateToUser()">${user.name}</a>`,
      );

      formattedProducts.email = `<p>${user.email}</p>`;
      formattedProducts.role = `<p>${user.role}</p>`;
      formattedProducts.creation_date = `<p>${user.creation_date}</p>`;
      formattedProducts.status = `<span class="badge badge-light-${
        user.status == 'active'
          ? 'success'
          : user.status == 'pending'
            ? 'warning'
            : ''
      }">${user.status.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</span>`;
      return formattedProducts;
    });
  }
}
