import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-colored-tooltip',
  imports: [NgbTooltipModule, Card],
  templateUrl: './colored-tooltip.html',
  styleUrl: './colored-tooltip.scss',
})
export class ColoredTooltip {}
