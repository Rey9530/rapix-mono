import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-background-pill-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './background-pill-tab.html',
  styleUrl: './background-pill-tab.scss',
})
export class BackgroundPillTab {
  public activeTab = 'tables';
}
