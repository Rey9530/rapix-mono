import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-tooltip-outlined',
  imports: [NgbTooltipModule, Card],
  templateUrl: './tooltip-outlined.html',
  styleUrl: './tooltip-outlined.scss',
})
export class TooltipOutlined {}
