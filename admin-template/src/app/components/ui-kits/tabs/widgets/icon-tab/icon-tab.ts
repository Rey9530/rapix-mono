import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-icon-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './icon-tab.html',
  styleUrl: './icon-tab.scss',
})
export class IconTab {
  public activeTab = 'home';
}
