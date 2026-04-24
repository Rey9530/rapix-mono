import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { variationTimeline } from '../../../../../shared/data/bonus-ui/timeline';

@Component({
  selector: 'app-variation-timeline',
  imports: [Card],
  templateUrl: './variation-timeline.html',
  styleUrl: './variation-timeline.scss',
})
export class VariationTimeline {
  public variationTimeline = variationTimeline;
}
