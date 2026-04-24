import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { teamPerformance } from '../../../../../shared/data/dashboard/projects';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITeamPerformance } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-team-performance',
  imports: [Card, Table],
  templateUrl: './team-performance.html',
  styleUrl: './team-performance.scss',
})
export class TeamPerformance {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;
  public teamPerformance = teamPerformance;

  public tableConfig: ITableConfigs<ITeamPerformance> = {
    columns: [
      { title: 'Team Member', field_value: 'name', sort: true },
      { title: 'Assigned', field_value: 'assigned', sort: true },
      { title: 'Completed', field_value: 'completed', sort: true },
      { title: 'Rate', field_value: 'rate', sort: true },
    ],

    data: [] as ITeamPerformance[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/project/project-list']);
    };

    this.tableConfig.data = teamPerformance.map((details: ITeamPerformance) => {
      const formattedDetails = { ...details };

      formattedDetails.name = this.sanitizer.bypassSecurityTrustHtml(
        `<a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${details.name}</a>`,
      );

      return formattedDetails;
    });
  }
}
