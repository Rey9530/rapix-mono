import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { sessionByBrowser } from '../../../../../shared/data/dashboard/analytics';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ISessionByBrowser } from '../../../../../shared/interface/dashboard/analytics';

@Component({
  selector: 'app-session-by-browser',
  imports: [Card, Table],
  templateUrl: './session-by-browser.html',
  styleUrl: './session-by-browser.scss',
})
export class SessionByBrowser {
  public sessionByBrowser = sessionByBrowser;
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<ISessionByBrowser> = {
    columns: [
      { title: 'Browser', field_value: 'browser' },
      { title: 'Sessions', field_value: 'sessions' },
    ],
    data: [] as ISessionByBrowser[],
  };

  ngOnInit() {
    this.tableConfig.data = sessionByBrowser.map(
      (details: ISessionByBrowser) => {
        const formattedDetails = { ...details };
        formattedDetails.browser = `<div class="common-flex align-items-center">
                                      <img class="img-fluid rounded-circle" src="${details.image}" alt="browsers">
                                      <a class="session-name" href="javascript:void(0)">${details.browser}</a>
                                  </div>`;

        return formattedDetails;
      },
    );
  }
}
