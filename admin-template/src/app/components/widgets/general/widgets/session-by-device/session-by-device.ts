import { Component, input } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { sessionByDeviceChart } from '../../../../../shared/data/widgets/general';

@Component({
  selector: 'app-session-by-device',
  imports: [NgApexchartsModule, Card],
  templateUrl: './session-by-device.html',
  styleUrl: './session-by-device.scss',
})
export class SessionByDevice {
  readonly type = input<string>();

  public sessionByDeviceChart = sessionByDeviceChart;
  public cardToggleOption = cardToggleOptions1;
}
