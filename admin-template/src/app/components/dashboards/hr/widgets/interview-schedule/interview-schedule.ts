import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions1 } from '../../../../../shared/data/common';
import { interviewSchedule } from '../../../../../shared/data/dashboard/hr';

@Component({
  selector: 'app-interview-schedule',
  imports: [Card],
  templateUrl: './interview-schedule.html',
  styleUrl: './interview-schedule.scss',
})
export class InterviewSchedule {
  public cardToggleOption = cardToggleOptions1;
  public interviewSchedule = interviewSchedule;
}
