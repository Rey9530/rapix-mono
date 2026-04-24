import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { anatomyTable } from '../../../../../shared/data/bootstrap-table';
import { IAnatomyTable } from '../../../../../shared/interface/bootstrap-table';
import { ITableConfigs } from '../../../../../shared/interface/common';

@Component({
  selector: 'app-anatomy-table',
  imports: [Table, Card],
  templateUrl: './anatomy-table.html',
  styleUrl: './anatomy-table.scss',
})
export class AnatomyTable {
  public anatomyTable = anatomyTable;

  public tableConfig: ITableConfigs<IAnatomyTable> = {
    columns: [
      { title: 'Version', field_value: 'version' },
      { title: 'Release Date', field_value: 'release_date' },
      { title: 'New Features', field_value: 'new_features' },
      { title: 'Bug Fixes', field_value: 'bug_fixes' },
    ],
    data: [] as IAnatomyTable[],
  };

  ngOnInit() {
    this.tableConfig.data = anatomyTable.map((details: IAnatomyTable) => {
      const formattedDetails = { ...details };
      formattedDetails.version = ` <span class="badge badge-${details.class}">${details.version}</span>`;
      return formattedDetails;
    });
  }
}
