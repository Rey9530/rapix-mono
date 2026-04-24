import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-bottom-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './bottom-tab.html',
  styleUrl: './bottom-tab.scss',
})
export class BottomTab {
  public activeTab = 'vendors';
}
