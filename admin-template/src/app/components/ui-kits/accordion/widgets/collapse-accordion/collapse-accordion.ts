import { Component } from '@angular/core';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-collapse-accordion',
  imports: [NgbCollapseModule, Card],
  templateUrl: './collapse-accordion.html',
  styleUrl: './collapse-accordion.scss',
})
export class CollapseAccordion {
  public isCollapsed = true;
}
