import { Component } from '@angular/core';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-svg-tooltip',
  imports: [NgbTooltipModule, Card, SvgIcon],
  templateUrl: './svg-tooltip.html',
  styleUrl: './svg-tooltip.scss',
})
export class SvgTooltip {}
