import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PermissionModal } from '../../../shared/components/ui/modal/permission-modal/permission-modal';
import { Table } from '../../../shared/components/ui/table/table';
import { roles } from '../../../shared/data/user';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../../shared/interface/common';
import { IRole } from '../../../shared/interface/user';

@Component({
  selector: 'app-roles-permission',
  imports: [Table],
  templateUrl: './roles-permission.html',
  styleUrl: './roles-permission.scss',
})
export class RolesPermission {
  private modal = inject(NgbModal);

  public roles: IRole[];
  public tableConfig: ITableConfigs<IRole> = {
    columns: [
      { title: 'Role Name', field_value: 'role', sort: true },
      { title: 'Creation Date', field_value: 'creation_date', sort: true },
      {
        title: 'Last Updated Date',
        field_value: 'last_update_date',
        sort: true,
      },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    row_action: [
      { label: 'Edit', action_to_perform: 'edit', icon: 'edit-content' },
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: true,
        model_text: 'Do you really want to delete the role?',
      },
    ],
    data: [] as IRole[],
  };

  ngOnInit() {
    this.roles = roles;
    this.tableConfig.data = this.formatRoleDetails(roles);
  }

  handleAction(value: ITableClickedAction<IRole>) {
    if (value.action_to_perform === 'delete' && value.data) {
      this.roles = this.roles.filter(
        (role: IRole) => role.id !== value.data!.id,
      );
      this.tableConfig = {
        ...this.tableConfig,
        data: this.formatRoleDetails(this.roles),
      };
    }
  }

  private formatRoleDetails(roles: IRole[]): IRole[] {
    return roles.map((role: IRole) => {
      const formattedRole = { ...role };
      formattedRole.role = `<p">${role.role}</p>`;

      formattedRole.creation_date = `<p>${role.creation_date}</p>`;
      formattedRole.last_update_date = `<p>${role.last_update_date}</p>`;
      formattedRole.status = `<span class="badge badge-light-${
        role.status == 'active'
          ? 'success'
          : role.status == 'pending'
            ? 'warning'
            : ''
      }">${role.status.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</span>`;
      return formattedRole;
    });
  }

  openPermissionModal() {
    this.modal.open(PermissionModal, {
      size: 'xl',
      centered: true,
      windowClass: 'role-permission-wrapper',
    });
  }
}
