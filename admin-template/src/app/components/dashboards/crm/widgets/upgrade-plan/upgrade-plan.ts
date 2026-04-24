import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-upgrade-plan',
  imports: [RouterModule, Card],
  templateUrl: './upgrade-plan.html',
  styleUrl: './upgrade-plan.scss',
})
export class UpgradePlan {}
