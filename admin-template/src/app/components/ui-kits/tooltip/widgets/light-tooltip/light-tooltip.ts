import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-light-tooltip',
  imports: [NgbTooltipModule, Card],
  templateUrl: './light-tooltip.html',
  styleUrl: './light-tooltip.scss',
})
export class LightTooltip {}
