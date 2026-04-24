import { Component } from '@angular/core';

import { IAnimatedTimeline } from './widgets/animated-timeline/animated-timeline';
import { BasicTimeline } from './widgets/basic-timeline/basic-timeline';
import { HalfRoundedTimeline } from './widgets/half-rounded-timeline/half-rounded-timeline';
import { IHorizontalTimeline } from './widgets/horizontal-timeline/horizontal-timeline';
import { HoveringTimeline } from './widgets/hovering-timeline/hovering-timeline';
import { VariationTimeline } from './widgets/variation-timeline/variation-timeline';

@Component({
  selector: 'app-timeline',
  imports: [
    IAnimatedTimeline,
    BasicTimeline,
    HoveringTimeline,
    VariationTimeline,
    IHorizontalTimeline,
    HalfRoundedTimeline,
  ],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {}
