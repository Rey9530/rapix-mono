import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-animated-ribbon',
  imports: [Card, SvgIcon],
  templateUrl: './animated-ribbon.html',
  styleUrl: './animated-ribbon.scss',
})
export class AnimatedRibbon {}
