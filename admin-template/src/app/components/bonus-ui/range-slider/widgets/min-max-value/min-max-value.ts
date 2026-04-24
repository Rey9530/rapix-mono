import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-min-max-value',
  imports: [NgxSliderModule, Card],
  templateUrl: './min-max-value.html',
  styleUrl: './min-max-value.scss',
})
export class MinMaxValue {
  public value: number = 100;
  public maxValue: number = 70;
  public options: Options = {
    floor: 0,
    ceil: 200,
  };
}
