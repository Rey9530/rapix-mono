import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { Table } from '../../../../../shared/components/ui/table/table';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { shipmentTracking } from '../../../../../shared/data/dashboard/logistics';
import { ITableConfigs } from '../../../../../shared/interface/common';
import { IShipmentTracking } from '../../../../../shared/interface/dashboard/logistics';

@Component({
  selector: 'app-shipment-tracking',
  imports: [Card, Table],
  templateUrl: './shipment-tracking.html',
  styleUrl: './shipment-tracking.scss',
})
export class ShipmentTracking {
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  public shipmentTracking = shipmentTracking;
  public cardToggleOption = cardToggleOptions3;

  public tableConfig: ITableConfigs<IShipmentTracking> = {
    columns: [
      { title: 'Shipment', field_value: 'shipment', sort: true },
      { title: 'Carrier', field_value: 'carrier', sort: true },
      { title: 'Origin', field_value: 'origin', sort: true },
      { title: 'Destination', field_value: 'destination', sort: true },
      {
        title: 'Current Location',
        field_value: 'current_location',
        sort: true,
      },
      { title: 'ETA', field_value: 'eta', sort: true },
      { title: 'Status', field_value: 'status', sort: true },
    ],

    data: [] as IShipmentTracking[],
  };

  ngOnInit() {
    window.navigate = () => {
      void this.router.navigate(['/order/1']);
    };

    this.tableConfig.data = shipmentTracking.map(
      (details: IShipmentTracking) => {
        const formattedDetails = { ...details };
        formattedDetails.shipment = this.sanitizer.bypassSecurityTrustHtml(
          `<a href="javascript:void(0)" onclick="navigate()">${details.shipment}</a>`,
        );

        formattedDetails.status = `<span class="badge f-14 f-w-400 txt-${details.class}">${details.status}</span>`;

        return formattedDetails;
      },
    );
  }
}
