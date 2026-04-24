import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { shipmentDetails } from '../../../../../shared/data/dashboard/logistics';

@Component({
  selector: 'app-shipment-details',
  imports: [Card],
  templateUrl: './shipment-details.html',
  styleUrl: './shipment-details.scss',
})
export class ShipmentDetails {
  public cardToggleOption = cardToggleOptions3;
  public shipmentDetails = shipmentDetails;
}
