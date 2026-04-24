import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { hoveringTimeline } from '../../../../../shared/data/bonus-ui/timeline';

@Component({
  selector: 'app-hovering-timeline',
  imports: [Card],
  templateUrl: './hovering-timeline.html',
  styleUrl: './hovering-timeline.scss',
})
export class HoveringTimeline {
  public hoveringTimeline = hoveringTimeline;
}
