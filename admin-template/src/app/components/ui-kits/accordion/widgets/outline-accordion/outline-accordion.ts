import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { outlineAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-outline-accordion',
  imports: [NgbAccordionModule, Card, FeatherIcon],
  templateUrl: './outline-accordion.html',
  styleUrl: './outline-accordion.scss',
})
export class OutlineAccordion {
  public outlineAccordion = outlineAccordion;
}
