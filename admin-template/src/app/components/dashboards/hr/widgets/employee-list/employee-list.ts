import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { employeeList } from '../../../../../shared/data/dashboard/hr';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../../../../shared/interface/common';
import { IEmployeeList } from '../../../../../shared/interface/dashboard/hr';

@Component({
  selector: 'app-employee-list',
  imports: [Card, Table],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public employeeList = employeeList;
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IEmployeeList> = {
    columns: [
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'Employees ID', field_value: 'employee_id', sort: true },
      { title: 'Email ID', field_value: 'email', sort: true },
      { title: 'Joining  Date', field_value: 'joining_date', sort: true },
      { title: 'Role', field_value: 'role', sort: true },
    ],
    row_action: [
      { label: 'Edit', action_to_perform: 'edit', icon: 'edit-content' },
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: false,
      },
    ],
    data: [] as IEmployeeList[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/user/user-list']);
    };

    this.tableConfig.data = this.formatEmployeeDetails(employeeList);
  }

  handleAction(value: ITableClickedAction<IEmployeeList>) {
    if (value.action_to_perform === 'delete' && value.data) {
      this.employeeList = this.employeeList.filter(
        (employee: IEmployeeList) => employee.id !== value.data!.id,
      );
      this.tableConfig = {
        ...this.tableConfig,
        data: this.formatEmployeeDetails(this.employeeList),
      };
    }
  }

  private formatEmployeeDetails(employees: IEmployeeList[]) {
    return employees.map((employee: IEmployeeList) => {
      const formattedEmployee = { ...employee };
      formattedEmployee.name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                      <img class="img-fluid rounded-circle" src="${employee.image}" alt="user">
                                      <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${employee.name}</a>
                                </div>`);

      return formattedEmployee;
    });
  }
}
