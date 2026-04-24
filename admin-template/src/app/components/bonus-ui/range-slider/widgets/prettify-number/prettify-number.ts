import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-prettify-number',
  imports: [NgxSliderModule, Card],
  templateUrl: './prettify-number.html',
  styleUrl: './prettify-number.scss',
})
export class PrettifyNumber {
  public value: number = 1000;

  public options: Options = {
    floor: 1000,
    ceil: 10000,
    showTicksValues: true,
    tickStep: 3000,
    tickValueStep: 100,
  };
}
