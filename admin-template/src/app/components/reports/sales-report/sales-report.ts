import { Component } from '@angular/core';

import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { salesReport } from '../../../shared/data/reports';
import { ITableConfigs } from '../../../shared/interface/common';
import { ISalesReport } from '../../../shared/interface/reports';

@Component({
  selector: 'app-sales-report',
  imports: [Card, Table],
  templateUrl: './sales-report.html',
  styleUrl: './sales-report.scss',
})
export class SalesReport {
  public salesReport: ISalesReport[];

  public tableConfig: ITableConfigs<ISalesReport> = {
    columns: [
      { title: 'Order Month', field_value: 'order_month', sort: true },
      { title: 'Total Sales', field_value: 'total_sales', sort: true },
      {
        title: 'Average Order Value',
        field_value: 'average_order_value',
        sort: true,
      },
      { title: 'Total Orders', field_value: 'total_orders', sort: true },
      { title: 'Growth Percentage', field_value: 'growth', sort: true },
    ],
    data: [] as ISalesReport[],
  };

  ngOnInit() {
    this.tableConfig.data = salesReport;
  }
}
