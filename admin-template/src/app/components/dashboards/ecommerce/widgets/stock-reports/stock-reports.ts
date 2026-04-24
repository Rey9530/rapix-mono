import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { stockReport } from '../../../../../shared/data/dashboard/e-commerce';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IStockReport } from '../../../../../shared/interface/dashboard/e-commerce';

@Component({
  selector: 'app-stock-reports',
  imports: [Card, Table],
  templateUrl: './stock-reports.html',
  styleUrl: './stock-reports.scss',
})
export class StockReports {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IStockReport> = {
    columns: [
      { title: 'Items', field_value: 'product_name', sort: true },
      { title: 'Product ID', field_value: 'product_id', sort: true },
      {
        title: 'QTY',
        field_value: 'quantity',
        sort: true,
        type: 'qty',
        text: 'PCS',
      },
      { title: 'Price', field_value: 'price', sort: true, type: 'price' },
      { title: 'Status', field_value: 'status', sort: true },
    ],
    data: [] as IStockReport[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/reports/products']);
    };

    this.tableConfig.data = stockReport.map((report: IStockReport) => {
      const formattedReport = { ...report };
      formattedReport.product_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                              <div class="img-border">
                                <img class="img-fluid rounded-circle" src="${report.product_image}" alt="user">
                              </div>
                              <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${report.product_name}</a>
                            </div>`);

      const statusHTML = `<button class="btn button-light-${report.color} txt-${report.color} f-w-500">${report.status}</button>`;

      formattedReport.status =
        this.sanitizer.bypassSecurityTrustHtml(statusHTML);

      return formattedReport;
    });
  }
}
