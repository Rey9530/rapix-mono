import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalTimeline } from '../../../../../shared/data/bonus-ui/timeline';

@Component({
  selector: 'app-horizontal-timeline',
  imports: [Card, NgClass],
  templateUrl: './horizontal-timeline.html',
  styleUrl: './horizontal-timeline.scss',
})
export class IHorizontalTimeline {
  public horizontalTimeline = horizontalTimeline;
}
