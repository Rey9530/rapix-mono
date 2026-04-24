import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-border-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './border-tab.html',
  styleUrl: './border-tab.scss',
})
export class BorderTab {
  public activeTab = 'inbox';
}
