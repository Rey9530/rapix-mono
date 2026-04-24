import { Component } from '@angular/core';

import { AnimatedColor } from './widgets/animated-color/animated-color';
import { HorizontalDashed } from './widgets/horizontal-dashed/horizontal-dashed';
import { HorizontalDotted } from './widgets/horizontal-dotted/horizontal-dotted';
import { HorizontalEditable } from './widgets/horizontal-editable/horizontal-editable';
import { HorizontalSimple } from './widgets/horizontal-simple/horizontal-simple';
import { HorizontalSolid } from './widgets/horizontal-solid/horizontal-solid';
import { VerticalDashed } from './widgets/vertical-dashed/vertical-dashed';
import { VerticalDotted } from './widgets/vertical-dotted/vertical-dotted';
import { VerticalDouble } from './widgets/vertical-double/vertical-double';
import { VerticalSimple } from './widgets/vertical-simple/vertical-simple';

@Component({
  selector: 'app-divider',
  imports: [
    HorizontalSolid,
    HorizontalDashed,
    HorizontalDotted,
    VerticalDashed,
    VerticalDotted,
    VerticalDouble,
    AnimatedColor,
    HorizontalEditable,
    HorizontalSimple,
    VerticalSimple,
  ],
  templateUrl: './divider.html',
  styleUrl: './divider.scss',
})
export class Divider {}
