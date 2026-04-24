import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-simple-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './simple-tab.html',
  styleUrl: './simple-tab.scss',
})
export class SimpleTab {
  public activeTab = 'profile';
}
