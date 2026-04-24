import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { aspectRatios } from '../../../../../shared/data/bonus-ui/ratios';

@Component({
  selector: 'app-aspect-ratios',
  imports: [Card],
  templateUrl: './aspect-ratios.html',
  styleUrl: './aspect-ratios.scss',
})
export class AspectRatios {
  public aspectRatios = aspectRatios;
}
