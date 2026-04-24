import { Component } from '@angular/core';

import { AnimatedRibbon } from './widgets/animated-ribbon/animated-ribbon';
import { LeftRibbon } from './widgets/left-ribbon/left-ribbon';
import { RightRibbon } from './widgets/right-ribbon/right-ribbon';

@Component({
  selector: 'app-ribbons',
  imports: [LeftRibbon, RightRibbon, AnimatedRibbon],
  templateUrl: './ribbons.html',
  styleUrl: './ribbons.scss',
})
export class Ribbons {}
