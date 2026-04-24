import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-icon-tooltip',
  imports: [NgbTooltipModule, Card],
  templateUrl: './icon-tooltip.html',
  styleUrl: './icon-tooltip.scss',
})
export class IconTooltip {}
