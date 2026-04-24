import { Component } from '@angular/core';

import { AvgDeliveryDuration } from './widgets/avg-delivery-duration/avg-delivery-duration';
import { FleetStatus } from './widgets/fleet-status/fleet-status';
import { OpenSalesOrder } from './widgets/open-sales-order/open-sales-order';
import { Overview } from './widgets/overview/overview';
import { ProfitByCountry } from './widgets/profit-by-country/profit-by-country';
import { ShipmentDetails } from './widgets/shipment-details/shipment-details';
import { ShipmentTracking } from './widgets/shipment-tracking/shipment-tracking';
import { VehiclesOverview } from './widgets/vehicles-overview/vehicles-overview';
import { overviews } from '../../../shared/data/dashboard/logistics';

@Component({
  selector: 'app-logistics',
  imports: [
    Overview,
    ShipmentTracking,
    AvgDeliveryDuration,
    ShipmentDetails,
    FleetStatus,
    OpenSalesOrder,
    ProfitByCountry,
    VehiclesOverview,
  ],
  templateUrl: './logistics.html',
  styleUrl: './logistics.scss',
})
export class Logistics {
  public overviews = overviews;
}
