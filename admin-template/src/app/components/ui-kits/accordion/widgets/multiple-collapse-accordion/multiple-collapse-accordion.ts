import { Component } from '@angular/core';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-multiple-collapse-accordion',
  imports: [NgbCollapseModule, Card],
  templateUrl: './multiple-collapse-accordion.html',
  styleUrl: './multiple-collapse-accordion.scss',
})
export class MultipleCollapseAccordion {
  public isCollapsedFirst = true;
  public isCollapsedSecond = true;
}
