import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { creators } from '../../../../../shared/data/dashboard/nft';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { ICreator } from '../../../../../shared/interface/dashboard/nft';

@Component({
  selector: 'app-creators',
  imports: [Card, Table],
  templateUrl: './creators.html',
  styleUrl: './creators.scss',
})
export class Creators {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public creators: ICreator[];
  public cardToggleOptions = cardToggleOptions1;

  public tableConfig: ITableConfigs<ICreator> = {
    columns: [
      { title: 'Creator Name', field_value: 'creator_name', sort: true },
      { title: 'Creations', field_value: 'creations', sort: true },
      { title: 'Followers', field_value: 'followers', sort: true },
    ],
    data: [] as ICreator[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/social-app']);
    };

    this.tableConfig.data = this.formatCreatorDetails(creators);
    this.creators = creators;
  }

  private formatCreatorDetails(creators: ICreator[]) {
    return creators.map((creator: ICreator) => {
      const formattedCreator = { ...creator };
      formattedCreator.creator_name = this.sanitizer
        .bypassSecurityTrustHtml(`<div class="d-flex">
                                        <img class="img-fluid rounded-circle me-2" src="${creator.creator_profile}" alt="user">
                                          <div class="img-content-box">
                                            <a class="f-w-500" href="javascript:void(0)" onclick="navigate()">${creator.creator_name}</a>
                                            <p class="mb-0 f-light">${creator.category}</p>
                                          </div>
                                        </div>`);

      return formattedCreator;
    });
  }
}
