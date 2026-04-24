import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { bestSeller } from '../../../../../shared/data/dashboard/e-commerce';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IBestSeller } from '../../../../../shared/interface/dashboard/e-commerce';

@Component({
  selector: 'app-best-sellers',
  imports: [Card, Table],
  templateUrl: './best-sellers.html',
  styleUrl: './best-sellers.scss',
})
export class BestSellers {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IBestSeller> = {
    columns: [
      { title: 'Sellers', field_value: 'seller_name', sort: true },
      { title: 'Company', field_value: 'company_name', sort: true },
      { title: 'Category', field_value: 'category', sort: true },
      { title: 'Earnings', field_value: 'earning', sort: true, type: 'price' },
    ],
    data: [] as IBestSeller[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/seller/list']);
    };

    this.tableConfig.data = bestSeller.map((seller: IBestSeller) => {
      const formattedSeller = { ...seller };
      formattedSeller.seller_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="common-flex align-items-center">
                                <img class="img-fluid rounded-circle" src="${seller.seller_profile}" alt="user">
                                <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${seller.seller_name}</a>
                              </div>`);

      return formattedSeller;
    });
  }
}
