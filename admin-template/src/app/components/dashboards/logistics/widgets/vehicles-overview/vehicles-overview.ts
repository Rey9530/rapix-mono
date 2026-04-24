import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { vehicleOverview } from '../../../../../shared/data/dashboard/logistics';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IVehiclesOverview } from '../../../../../shared/interface/dashboard/logistics';

@Component({
  selector: 'app-vehicles-overview',
  imports: [Card, Table],
  templateUrl: './vehicles-overview.html',
  styleUrl: './vehicles-overview.scss',
})
export class VehiclesOverview {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public vehicleOverview = vehicleOverview;
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IVehiclesOverview> = {
    columns: [
      { title: 'Vehicle ID', field_value: 'vehicle_id', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
      { title: 'Driver Name', field_value: 'driver_name', sort: true },
      { title: 'Next Due', field_value: 'next_due', sort: true },
      { title: 'Total Distance', field_value: 'total_distance', sort: true },
      { title: 'Location', field_value: 'location', sort: true },
    ],

    data: [] as IVehiclesOverview[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/order/1']);
    };

    this.tableConfig.data = vehicleOverview.map(
      (details: IVehiclesOverview) => {
        const formattedDetails = { ...details };
        formattedDetails.vehicle_id = this.sanitizer.bypassSecurityTrustHtml(
          `<a href="javascript:void(0)"  onclick="navigate()">${details.vehicle_id}</a>`,
        );

        formattedDetails.driver_name = `<div class="common-flex align-items-center">
                                      <img class="img-fluid rounded-circle" src="${details.image}" alt="user">
                                      <a class="f-w-500" href="javascript:void(0)" >${details.driver_name}</a>
                                      </div>`;

        return formattedDetails;
      },
    );
  }
}
