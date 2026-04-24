import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { CardDropdownButton } from '../../../../../shared/components/ui/card/card-dropdown-button/card-dropdown-button';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions7 } from '../../../../../shared/data/common';
import { artworks } from '../../../../../shared/data/dashboard/nft';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IArtwork } from '../../../../../shared/interface/dashboard/nft';

@Component({
  selector: 'app-artworks',
  imports: [CardDropdownButton, Table],
  templateUrl: './artworks.html',
  styleUrl: './artworks.scss',
})
export class Artworks {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public dropdownToggleOption = cardToggleOptions7;
  public artworks: IArtwork[];

  public tableConfig: ITableConfigs<IArtwork> = {
    columns: [
      { title: 'Course', field_value: 'course_name', sort: false },
      { title: 'Sale', field_value: 'sale', sort: false },
      { title: 'Earnings', field_value: 'earnings', sort: false },
    ],
    data: [] as IArtwork[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/seller/1']);
    };

    this.tableConfig.data = this.formatArtworkDetails(artworks);
    this.artworks = artworks;
  }

  private formatArtworkDetails(artworks: IArtwork[]) {
    return artworks.map((artwork: IArtwork) => {
      const formattedArtwork = { ...artwork };
      formattedArtwork.course_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="d-flex align-items-center gap-2"> 
                                        <img src="${artwork.course_profile}" alt="${artwork.course_name}">
                                        <div> 
                                          <a class="f-14" href="javascript:void(0)" onclick="navigate()">
                                            ${artwork.course_name}
                                          </a>
                                          <span class="f-light f-12">${artwork.course_site}</span></div>
                                      </div>`);

      formattedArtwork.sale = `<h6 class="f-14">${artwork.sale}</h6>`;

      formattedArtwork.earnings = `<span class="badge badge-light-success f-w-500">$${artwork.earnings}</span>`;

      return formattedArtwork;
    });
  }
}
