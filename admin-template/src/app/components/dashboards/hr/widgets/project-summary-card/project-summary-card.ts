import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-project-summary-card',
  imports: [Card],
  templateUrl: './project-summary-card.html',
  styleUrl: './project-summary-card.scss',
})
export class ProjectSummaryCard {
  public item: number[] = Array.from({ length: 12 }, (_, index) => index);
}
