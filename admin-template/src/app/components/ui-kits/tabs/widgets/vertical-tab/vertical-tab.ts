import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-vertical-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './vertical-tab.html',
  styleUrl: './vertical-tab.scss',
})
export class VerticalTab {
  public activeTab = 'components';
}
