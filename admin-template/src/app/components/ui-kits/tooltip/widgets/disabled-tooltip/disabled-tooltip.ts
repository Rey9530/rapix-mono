import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-disabled-tooltip',
  imports: [NgbTooltipModule, Card],
  templateUrl: './disabled-tooltip.html',
  styleUrl: './disabled-tooltip.scss',
})
export class DisabledTooltip {}
