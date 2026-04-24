import { Component } from '@angular/core';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  employees,
  justifyTabs,
} from '../../../../../shared/data/ui-kits/tabs';

@Component({
  selector: 'app-justify-tab',
  imports: [NgbNavModule, Card],
  templateUrl: './justify-tab.html',
  styleUrl: './justify-tab.scss',
})
export class JustifyTab {
  public justifyTabs = justifyTabs;
  public employees = employees;
  public activeTab = 'ux-designer';
}
