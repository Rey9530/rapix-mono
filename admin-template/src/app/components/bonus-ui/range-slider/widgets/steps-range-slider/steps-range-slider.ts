import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-steps-range-slider',
  imports: [NgxSliderModule, Card],
  templateUrl: './steps-range-slider.html',
  styleUrl: './steps-range-slider.scss',
})
export class StepsRangeSlider {
  public minValue: number = 1;
  public maxValue: number = 8;
  public options: Options = {
    floor: 0,
    ceil: 10,
    showTicksValues: true,
  };
}
