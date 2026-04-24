import { Component } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { iconAccordion } from '../../../../../shared/data/ui-kits/accordion';

@Component({
  selector: 'app-icon-accordion',
  imports: [NgbAccordionModule, Card, FeatherIcon],
  templateUrl: './icon-accordion.html',
  styleUrl: './icon-accordion.scss',
})
export class IconAccordion {
  public iconAccordion = iconAccordion;
}
