import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { leaveRequests } from '../../../../../shared/data/dashboard/hr';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ILeaveRequest } from '../../../../../shared/interface/dashboard/hr';

@Component({
  selector: 'app-leave-request',
  imports: [Card, Table],
  templateUrl: './leave-request.html',
  styleUrl: './leave-request.scss',
})
export class LeaveRequest {
  public leaveRequests = leaveRequests;
  public cardToggleOption = cardToggleOptions1;

  public tableConfig: ITableConfigs<ILeaveRequest> = {
    columns: [
      { title: 'Name', field_value: 'name', sort: true },
      { title: 'Reason', field_value: 'reason', sort: true },
      { title: 'Action', field_value: 'action', sort: true },
    ],

    data: [] as ILeaveRequest[],
  };

  ngOnInit() {
    this.tableConfig.data = leaveRequests.map((details: ILeaveRequest) => {
      const formattedDetails = { ...details };
      formattedDetails.name = `  <div class="d-flex">
                                  <img class="img-fluid img-40 rounded-circle me-2" src="${details.image}" alt="user">
                                <div class="img-content-box">
                                  <a class="f-w-500" href="javascript:void(0)">${details.name}</a>
                                  <p class="mb-0 f-light">${details.leave_period}</p>
                                </div>
                              </div>`;

      formattedDetails.action = `<div class="common-align gap-2 justify-content-start">
                                  <div class="approval-box bg-success"><i class="fa-solid fa-check text-white"></i></div>
                                  <div class="approval-box border border-danger"><i class="fa-solid fa-ban txt-danger"></i></div>
                                </div>`;

      return formattedDetails;
    });
  }
}
