import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { recentTransactions } from '../../../../../shared/data/dashboard/e-commerce';
import { IHasId, ITableConfigs } from '../../../../../shared/interface/common';

@Component({
  selector: 'app-recent-transactions',
  imports: [Card, Table],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.scss',
})
export class RecentTransactions {
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IHasId> = {
    columns: [
      { title: 'Transaction ID', field_value: 'transaction_id', sort: true },
      { title: 'Date', field_value: 'date', sort: true },
      { title: 'Customers', field_value: 'customer_name', sort: true },
      { title: 'Product', field_value: 'product_name', sort: true },
      { title: 'QTY', field_value: 'quantity', sort: true },
      { title: 'Payments', field_value: 'payments', sort: true },
      {
        title: 'Total Amount',
        field_value: 'total',
        sort: true,
        type: 'price',
      },
    ],
    data: recentTransactions,
  };
}
