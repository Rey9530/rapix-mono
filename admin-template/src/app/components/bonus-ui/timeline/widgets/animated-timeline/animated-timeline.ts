import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { animatedTimeline } from '../../../../../shared/data/bonus-ui/timeline';

@Component({
  selector: 'app-animated-timeline',
  imports: [Card],
  templateUrl: './animated-timeline.html',
  styleUrl: './animated-timeline.scss',
})
export class IAnimatedTimeline {
  public animatedTimeline = animatedTimeline;
}
