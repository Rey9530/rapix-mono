import { Component } from '@angular/core';

import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-core-ui',
  imports: [NgxSliderModule, Card],
  templateUrl: './core-ui.html',
  styleUrl: './core-ui.scss',
})
export class CoreUi {
  public minValue: number = 100;
  public maxValue: number = 400;
  public options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number): string => {
      return 'Follower ' + value;
    },
  };
}
