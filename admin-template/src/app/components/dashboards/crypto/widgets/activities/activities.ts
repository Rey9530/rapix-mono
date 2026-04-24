import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions7 } from '../../../../../shared/data/common';
import { activities } from '../../../../../shared/data/dashboard/crypto';

@Component({
  selector: 'app-activities',
  imports: [RouterModule, Card],
  templateUrl: './activities.html',
  styleUrl: './activities.scss',
})
export class Activities {
  public activities = activities;
  public cardToggleOption = cardToggleOptions7;
}
