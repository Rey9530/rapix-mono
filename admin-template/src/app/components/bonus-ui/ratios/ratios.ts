import { Component } from '@angular/core';

import { AspectRatios } from './widgets/aspect-ratios/aspect-ratios';
import { CustomRatio } from './widgets/custom-ratio/custom-ratio';
import { DefaultRatio } from './widgets/default-ratio/default-ratio';

@Component({
  selector: 'app-ratios',
  imports: [AspectRatios, CustomRatio, DefaultRatio],
  templateUrl: './ratios.html',
  styleUrl: './ratios.scss',
})
export class Ratios {}
