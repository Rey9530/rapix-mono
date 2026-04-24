import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { simpleAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-simple-accordion',
  imports: [NgbAccordionModule, Card, FeatherIcon],
  templateUrl: './simple-accordion.html',
  styleUrl: './simple-accordion.scss',
})
export class SimpleAccordion {
  public simpleAccordion = simpleAccordion;
}
