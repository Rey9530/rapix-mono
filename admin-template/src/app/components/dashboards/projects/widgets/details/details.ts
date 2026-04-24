import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { IProjectDetails } from '../../../../../shared/interface/dashboard/projects';

@Component({
  selector: 'app-details',
  imports: [Card, SvgIcon],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  readonly details = input<IProjectDetails>();
}
