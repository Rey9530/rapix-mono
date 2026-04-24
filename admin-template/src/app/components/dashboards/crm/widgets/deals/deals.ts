import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions5 } from '../../../../../shared/data/common';
import { IHasId, ITableConfigs } from '../../../../../shared/interface/common';
import { deals } from './../../../../../shared/data/dashboard/crm';

@Component({
  selector: 'app-deals',
  imports: [Card, Table],
  templateUrl: './deals.html',
  styleUrl: './deals.scss',
})
export class Deals {
  public cardToggleOption = cardToggleOptions5;

  public tableConfig: ITableConfigs<IHasId> = {
    columns: [
      { title: 'Deal id', field_value: 'deal_id', sort: true },
      { title: 'Deal Name', field_value: 'deal_name', sort: true },
      { title: 'Amount', field_value: 'amount', sort: true, type: 'price' },
      { title: 'Close Date', field_value: 'close_date', sort: true },
    ],
    data: deals,
  };
}
