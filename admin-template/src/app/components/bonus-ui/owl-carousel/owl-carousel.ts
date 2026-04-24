import { Component } from '@angular/core';

import { AutoPlayVariant } from './widgets/auto-play-variant/auto-play-variant';
import { CrossFade } from './widgets/cross-fade/cross-fade';
import { IDarkVariant } from './widgets/dark-variant/dark-variant';
import { DisableTouch } from './widgets/disable-touch/disable-touch';
import { IndividualItem } from './widgets/individual-item/individual-item';
import { MouseWheelVariant } from './widgets/mouse-wheel-variant/mouse-wheel-variant';
import { INestedSwiper } from './widgets/nested-swiper/nested-swiper';
import { SlidesOnly } from './widgets/slides-only/slides-only';
import { VerticalSlider } from './widgets/vertical-slider/vertical-slider';
import { WithCaption } from './widgets/with-caption/with-caption';
import { WithControls } from './widgets/with-controls/with-controls';
import { WithIndicators } from './widgets/with-indicators/with-indicators';

@Component({
  selector: 'app-owl-carousel',
  imports: [
    SlidesOnly,
    WithControls,
    WithIndicators,
    WithCaption,
    CrossFade,
    IndividualItem,
    DisableTouch,
    IDarkVariant,
    VerticalSlider,
    INestedSwiper,
    MouseWheelVariant,
    AutoPlayVariant,
  ],
  templateUrl: './owl-carousel.html',
  styleUrl: './owl-carousel.scss',
})
export class OwlCarousel {}
