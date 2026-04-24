import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { verticalAlignment } from '../../../../../shared/data/bootstrap-table';
import { IHasId, ITableConfigs } from '../../../../../shared/interface/common';

@Component({
  selector: 'app-vertical-alignment-table',
  imports: [Table, Card],
  templateUrl: './vertical-alignment-table.html',
  styleUrl: './vertical-alignment-table.scss',
})
export class VerticalAlignmentTable {
  public verticalAlignment = verticalAlignment;

  public tableConfig: ITableConfigs<IHasId> = {
    columns: [
      { title: 'Heading1', field_value: 'heading1' },
      { title: 'Heading2', field_value: 'heading2' },
      { title: 'Heading3', field_value: 'heading3' },
      { title: 'Heading4', field_value: 'heading4' },
    ],
    data: verticalAlignment,
  };
}
