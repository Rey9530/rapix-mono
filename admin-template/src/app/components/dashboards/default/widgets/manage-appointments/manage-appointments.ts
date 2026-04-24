import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { manageAppointments } from '../../../../../shared/data/dashboard/default';

@Component({
  selector: 'app-manage-appointments',
  imports: [Card],
  templateUrl: './manage-appointments.html',
  styleUrl: './manage-appointments.scss',
})
export class ManageAppointments {
  public cardToggleOptions = cardToggleOptions1;
  public manageAppointments = manageAppointments;
}
