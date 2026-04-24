import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { halfRoundedTimeline } from '../../../../../shared/data/bonus-ui/timeline';

@Component({
  selector: 'app-half-rounded-timeline',
  imports: [Card],
  templateUrl: './half-rounded-timeline.html',
  styleUrl: './half-rounded-timeline.scss',
})
export class HalfRoundedTimeline {
  public halfRoundedTimeline = halfRoundedTimeline;
}
