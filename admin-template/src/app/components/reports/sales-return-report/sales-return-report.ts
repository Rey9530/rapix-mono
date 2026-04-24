import { Component } from '@angular/core';

import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { salesReturnReport } from '../../../shared/data/reports';
import { ITableConfigs } from '../../../shared/interface/common';
import { ISalesReturnReport } from '../../../shared/interface/reports';

@Component({
  selector: 'app-sales-return-report',
  imports: [Card, Table],
  templateUrl: './sales-return-report.html',
  styleUrl: './sales-return-report.scss',
})
export class SalesReturnReport {
  public salesReport: ISalesReturnReport[];

  public tableConfig: ITableConfigs<ISalesReturnReport> = {
    columns: [
      { title: 'Month', field_value: 'month', sort: true },
      { title: 'Total Items', field_value: 'total_item', sort: true },
      { title: 'Ordered', field_value: 'order', sort: true },
      { title: 'Returned', field_value: 'return', sort: true },
      { title: 'Reason of Return', field_value: 'reason', sort: true },
      { title: 'Total Replace', field_value: 'total_replace', sort: true },
      {
        title: 'Total Return',
        field_value: 'total_return',
        sort: true,
        type: 'price',
      },
    ],
    data: [] as ISalesReturnReport[],
  };

  ngOnInit() {
    this.tableConfig.data = salesReturnReport;
  }
}
