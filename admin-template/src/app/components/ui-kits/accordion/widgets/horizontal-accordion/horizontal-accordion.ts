import { Component } from '@angular/core';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-horizontal-accordion',
  imports: [NgbCollapseModule, Card],
  templateUrl: './horizontal-accordion.html',
  styleUrl: './horizontal-accordion.scss',
})
export class HorizontalAccordion {
  public isCollapsed = true;
}
