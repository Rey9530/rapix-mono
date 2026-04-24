import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { IEmployeeDetails } from '../../../../../shared/interface/dashboard/hr';

@Component({
  selector: 'app-employee-details',
  imports: [Card, SvgIcon, DecimalPipe],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.scss',
})
export class EmployeeDetails {
  readonly details = input<IEmployeeDetails>();
}
