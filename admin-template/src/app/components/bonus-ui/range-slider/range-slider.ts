import { Component } from '@angular/core';

import { CoreUi } from './widgets/core-ui/core-ui';
import { CustomValue } from './widgets/custom-value/custom-value';
import { DefaultRangeSlider } from './widgets/default-range-slider/default-range-slider';
import { DisabledSlider } from './widgets/disabled-slider/disabled-slider';
import { MinMaxValue } from './widgets/min-max-value/min-max-value';
import { NegativeValue } from './widgets/negative-value/negative-value';
import { PrettifyNumber } from './widgets/prettify-number/prettify-number';
import { StepsRangeSlider } from './widgets/steps-range-slider/steps-range-slider';

@Component({
  selector: 'app-range-slider',
  imports: [
    DefaultRangeSlider,
    MinMaxValue,
    NegativeValue,
    StepsRangeSlider,
    CustomValue,
    PrettifyNumber,
    DisabledSlider,
    CoreUi,
  ],
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.scss',
})
export class RangeSlider {}
