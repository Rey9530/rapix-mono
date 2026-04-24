import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions7 } from '../../../../../shared/data/common';
import { topNFT } from '../../../../../shared/data/dashboard/nft';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ITopNFT } from '../../../../../shared/interface/dashboard/nft';

@Component({
  selector: 'app-top-nft',
  imports: [Card, Table],
  templateUrl: './top-nft.html',
  styleUrl: './top-nft.scss',
})
export class TopNft {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public nfts: ITopNFT[];
  public cardToggleOptions = cardToggleOptions7;

  public tableConfig: ITableConfigs<ITopNFT> = {
    columns: [
      { title: 'Collections', field_value: 'collection_name', sort: true },
      { title: 'Volume', field_value: 'volume', sort: true },
      { title: '24h %', field_value: 'profit', sort: true },
      { title: 'Items', field_value: 'items', sort: true },
    ],
    data: [] as ITopNFT[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/category']);
    };

    this.tableConfig.data = this.formatNFTDetails(topNFT);
    this.nfts = topNFT;
  }

  private formatNFTDetails(nfts: ITopNFT[]) {
    return nfts.map((nft: ITopNFT) => {
      const formattedNFT = { ...nft };
      formattedNFT.collection_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="product-content">
                                        <div class="order-image">
                                          <img src="${nft.profile}" alt="author">
                                          <img class="mark-img" src="assets/images/dashboard-6/author/mark.png" alt="mark icon">
                                        </div>
                                        <div> 
                                          <h6 class="f-14 mb-0">
                                            <a href="javascript:void(0" onclick="navigate()">${nft.collection_name}</a>
                                          </h6>
                                          <span class="f-light f-12">Manfers nfts</span>
                                        </div>
                                      </div>`);

      formattedNFT.volume = `<div class="d-flex align-items-center">
                                <img class="me-2" src="assets/images/dashboard-6/nft.png" alt="nft icon">
                                <span>$${nft.volume}</span>
                              </div>`;

      formattedNFT.profit = `<div class="d-flex align-items-center font-${nft.profit_type == 'profit' ? 'success' : 'danger'}"><span>${nft.profit}</span></div>`;

      return formattedNFT;
    });
  }
}
