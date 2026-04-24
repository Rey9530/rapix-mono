import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-pills-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './pills-tab.html',
  styleUrl: './pills-tab.scss',
})
export class PillsTab {
  public activeTab = 'blog';
}
