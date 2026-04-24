import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { allProjects } from '../../../../../shared/data/dashboard/projects';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IAllProjects } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-all-projects',
  imports: [Card, Table],
  templateUrl: './all-projects.html',
  styleUrl: './all-projects.scss',
})
export class AllProjects {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;
  public allProjects = allProjects;

  public tableConfig: ITableConfigs<IAllProjects> = {
    columns: [
      { title: 'Id', field_value: 'project_id', sort: true },
      { title: 'Manager Name', field_value: 'name', sort: true },
      { title: 'Project Name', field_value: 'project_name', sort: true },
      { title: 'Start Date', field_value: 'start_date', sort: true },
      { title: 'End Date', field_value: 'end_date', sort: true },
      { title: 'Priority', field_value: 'priority', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],

    data: [] as IAllProjects[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/project/project-details']);
    };

    this.tableConfig.data = allProjects.map((details: IAllProjects) => {
      const formattedDetails = { ...details };
      formattedDetails.project_id = this.sanitizer.bypassSecurityTrustHtml(
        `<a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${details.project_id}</a>`,
      );

      formattedDetails.name = `<div class="common-flex align-items-center">
                              <img class="img-fluid rounded-circle" src="${details.image}" alt="user">
                              <a href="javascript:void(0)">${details.name}</a>
                              </div>`;

      formattedDetails.status = `<span class="badge badge-light-${details.class}">${details.status}</span>`;

      return formattedDetails;
    });
  }
}
