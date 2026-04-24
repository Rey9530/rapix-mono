import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-disabled-slider',
  imports: [NgxSliderModule, Card],
  templateUrl: './disabled-slider.html',
  styleUrl: './disabled-slider.scss',
})
export class DisabledSlider {
  public value: number = 550;

  public options: Options = {
    floor: 100,
    ceil: 1000,
    disabled: true,
  };
}
