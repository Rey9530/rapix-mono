import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Card } from '../../../shared/components/ui/card/card';
import { Table } from '../../../shared/components/ui/table/table';
import { country } from '../../../shared/data/data-table';
import { ITableConfigs } from '../../../shared/interface/common';
import { ICountry } from '../../../shared/interface/data-table';

@Component({
  selector: 'app-data-table',
  imports: [Table, Card],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  private sanitizer = inject(DomSanitizer);

  public country = country;

  public tableConfig: ITableConfigs<ICountry> = {
    columns: [
      { title: '#', field_value: 'id', sort: true },
      { title: 'Country', field_value: 'country_name', sort: true },
      { title: 'Area', field_value: 'area', sort: true },
      { title: 'Population', field_value: 'population', sort: true },
    ],
    data: [] as ICountry[],
  };

  ngOnInit() {
    this.tableConfig.data = country.map((country: ICountry) => {
      const formattedCountry = { ...country };
      const html = `<img src="https://upload.wikimedia.org/wikipedia/commons/${country.flag}"	
                       [alt]="'The flag of '${country.country_name}" 
                      class="me-2" 
                     style="width:20px"/> ${country.country_name}`;

      formattedCountry.country_name =
        this.sanitizer.bypassSecurityTrustHtml(html);

      return formattedCountry;
    });
  }
}
