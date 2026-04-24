import { Component, input } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { IOverview } from '../../../../../shared/interface/dashboard/logistics';

@Component({
  selector: 'app-overview',
  imports: [
    NgApexchartsModule,
    NgbProgressbarModule,
    Card,
    SvgIcon,
    FeatherIcon,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  readonly overview = input<IOverview>();
}
