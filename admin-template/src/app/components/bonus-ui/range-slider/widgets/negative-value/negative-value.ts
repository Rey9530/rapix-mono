import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-negative-value',
  imports: [NgxSliderModule, Card],
  templateUrl: './negative-value.html',
  styleUrl: './negative-value.scss',
})
export class NegativeValue {
  public value: number = -500;
  public maxValue: number = 500;
  public options: Options = {
    floor: -1000,
    ceil: 1000,
  };
}
