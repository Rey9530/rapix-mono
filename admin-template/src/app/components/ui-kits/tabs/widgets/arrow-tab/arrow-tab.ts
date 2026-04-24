import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-arrow-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './arrow-tab.html',
  styleUrl: './arrow-tab.scss',
})
export class ArrowTab {
  public activeTab = 'portfolio';
}
