import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-material-style-left-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './material-style-left-tab.html',
  styleUrl: './material-style-left-tab.scss',
})
export class MaterialStyleLeftTab {
  public activeTab = 'home';
}
