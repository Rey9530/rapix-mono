import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { basicTimeline } from '../../../../../shared/data/bonus-ui/timeline';

@Component({
  selector: 'app-basic-timeline',
  imports: [Card],
  templateUrl: './basic-timeline.html',
  styleUrl: './basic-timeline.scss',
})
export class BasicTimeline {
  public basicTimeline = basicTimeline;
}
