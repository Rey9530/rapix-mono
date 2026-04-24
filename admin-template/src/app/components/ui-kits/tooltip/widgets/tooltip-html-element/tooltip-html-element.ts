import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-tooltip-html-element',
  imports: [NgbTooltipModule, Card],
  templateUrl: './tooltip-html-element.html',
  styleUrl: './tooltip-html-element.scss',
})
export class TooltipHtmlElement {}
