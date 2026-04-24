import { Component } from '@angular/core';

import { AnimationPlaceholder } from './widgets/animation-placeholder/animation-placeholder';
import { CardPlaceholder } from './widgets/card-placeholder/card-placeholder';
import { ColorPlaceholder } from './widgets/color-placeholder/color-placeholder';
import { CustomAnimationPlaceholder } from './widgets/custom-animation-placeholder/custom-animation-placeholder';
import { WidthSizingPlaceholder } from './widgets/width-sizing-placeholder/width-sizing-placeholder';

@Component({
  selector: 'app-placeholders',
  imports: [
    CardPlaceholder,
    WidthSizingPlaceholder,
    AnimationPlaceholder,
    CustomAnimationPlaceholder,
    ColorPlaceholder,
  ],
  templateUrl: './placeholders.html',
  styleUrl: './placeholders.scss',
})
export class Placeholders {}
