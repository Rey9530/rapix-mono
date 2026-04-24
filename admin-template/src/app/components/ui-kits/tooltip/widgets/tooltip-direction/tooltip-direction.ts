import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-tooltip-direction',
  imports: [NgbTooltipModule, Card],
  templateUrl: './tooltip-direction.html',
  styleUrl: './tooltip-direction.scss',
})
export class TooltipDirection {}
