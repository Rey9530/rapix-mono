import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-custom-value',
  imports: [NgxSliderModule, Card],
  templateUrl: './custom-value.html',
  styleUrl: './custom-value.scss',
})
export class CustomValue {
  public value: number = 4;

  public options: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: 'Jan' },
      { value: 2, legend: 'Feb' },
      { value: 3, legend: 'Mar' },
      { value: 4, legend: 'Apr' },
      { value: 5, legend: 'May' },
      { value: 6, legend: 'Jun' },
      { value: 7, legend: 'July' },
      { value: 8, legend: 'Aug' },
      { value: 9, legend: 'Sept' },
      { value: 10, legend: 'Oct' },
      { value: 11, legend: 'Nov' },
      { value: 12, legend: 'Dec' },
    ],
  };
}
