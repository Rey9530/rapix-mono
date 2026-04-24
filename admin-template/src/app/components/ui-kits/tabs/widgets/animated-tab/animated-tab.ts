import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-animated-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './animated-tab.html',
  styleUrl: './animated-tab.scss',
})
export class AnimatedTab {
  public activeTab = 'profile';
}
