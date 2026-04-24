import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { ISchoolDetails } from '../../../../../shared/interface/dashboard/school-management';

@Component({
  selector: 'app-school-details',
  imports: [Card],
  templateUrl: './school-details.html',
  styleUrl: './school-details.scss',
})
export class SchoolDetails {
  readonly details = input<ISchoolDetails>();
}
