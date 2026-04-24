import { Component } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { fleetStatus } from '../../../../../shared/data/dashboard/logistics';

@Component({
  selector: 'app-fleet-status',
  imports: [NgApexchartsModule, Card],
  templateUrl: './fleet-status.html',
  styleUrl: './fleet-status.scss',
})
export class FleetStatus {
  public cardToggleOption = cardToggleOptions3;
  public fleetStatus = fleetStatus;
}
