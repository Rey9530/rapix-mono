import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-material-style-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './material-style-tab.html',
  styleUrl: './material-style-tab.scss',
})
export class MaterialStyleTab {
  public activeTab = 'user';
}
