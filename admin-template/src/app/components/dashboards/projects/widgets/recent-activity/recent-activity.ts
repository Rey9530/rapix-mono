import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { recentActivity } from '../../../../../shared/data/dashboard/projects';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IRecentActivity } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-recent-activity',
  imports: [Card, Table],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.scss',
})
export class RecentActivity {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;
  public recentActivity = recentActivity;

  public tableConfig: ITableConfigs<IRecentActivity> = {
    columns: [
      { title: 'Activity Description', field_value: 'description', sort: true },
      { title: 'Project', field_value: 'project', sort: true },
      { title: 'Performed By', field_value: 'performed_by', sort: true },
      { title: 'Date', field_value: 'date', sort: true },
    ],

    data: [] as IRecentActivity[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/project/project-details']);
    };

    this.tableConfig.data = recentActivity.map((details: IRecentActivity) => {
      const formattedDetails = { ...details };
      formattedDetails.description = this.sanitizer.bypassSecurityTrustHtml(
        `<a href="javascript:void(0)" onclick="navigate()">${details.description}</a>`,
      );

      return formattedDetails;
    });
  }
}
