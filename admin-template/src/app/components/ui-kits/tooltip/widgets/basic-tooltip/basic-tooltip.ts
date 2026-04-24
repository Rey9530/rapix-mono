import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-basic-tooltip',
  imports: [NgbTooltipModule, Card],
  templateUrl: './basic-tooltip.html',
  styleUrl: './basic-tooltip.scss',
})
export class BasicTooltip {}
