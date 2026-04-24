import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { flushAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-flush-accordion',
  imports: [NgbAccordionModule, Card, FeatherIcon],
  templateUrl: './flush-accordion.html',
  styleUrl: './flush-accordion.scss',
})
export class FlushAccordion {
  public flushAccordion = flushAccordion;
}
