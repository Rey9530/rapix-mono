import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { artworksDetails } from '../../../../../shared/data/dashboard/nft';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IArtworkDetails } from '../../../../../shared/interface/dashboard/nft';

@Component({
  selector: 'app-artwork-table',
  imports: [Card, Table],
  templateUrl: './artwork-table.html',
  styleUrl: './artwork-table.scss',
})
export class ArtworkTable {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public artworks: IArtworkDetails[];
  public cardToggleOptions = cardToggleOptions1;

  public tableConfig: ITableConfigs<IArtworkDetails> = {
    columns: [
      { title: 'Artwork Name', field_value: 'artwork_name', sort: true },
      { title: 'Total Sales', field_value: 'total_sales', sort: true },
      { title: 'Total USD', field_value: 'total_usd', sort: true },
    ],
    data: [] as IArtworkDetails[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/seller/list']);
    };

    this.tableConfig.data = this.formatArtworkrDetails(artworksDetails);
    this.artworks = artworksDetails;
  }

  private formatArtworkrDetails(artworksDetails: IArtworkDetails[]) {
    return artworksDetails.map((artwork: IArtworkDetails) => {
      const formattedArtwork = { ...artwork };
      formattedArtwork.artwork_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="d-flex">
                                        <img class="img-fluid rounded-circle me-2" src="${artwork.artwork_profile}" alt="user">
                                        <div class="img-content-box">
                                          <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${artwork.artwork_name}</a>
                                          <p class="mb-0 f-light">${artwork.owner_name}</p>
                                        </div>
                                      </div>`);

      return formattedArtwork;
    });
  }
}
