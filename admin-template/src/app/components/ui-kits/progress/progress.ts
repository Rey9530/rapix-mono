import { Component } from '@angular/core';

import { AnimatedProgressBar } from './widgets/animated-progress-bar/animated-progress-bar';
import { CustomProgressBar } from './widgets/custom-progress-bar/custom-progress-bar';
import { CustomSizeProgressBar } from './widgets/custom-size-progress-bar/custom-size-progress-bar';
import { InitialProgressBar } from './widgets/initial-progress-bar/initial-progress-bar';
import { LargeProgressBar } from './widgets/large-progress-bar/large-progress-bar';
import { MultipleBar } from './widgets/multiple-bar/multiple-bar';
import { NumberStepProgress } from './widgets/number-step-progress/number-step-progress';
import { SmallProgressBar } from './widgets/small-progress-bar/small-progress-bar';
import { StepProgressBar } from './widgets/step-progress-bar/step-progress-bar';
import { StripedProgressBar } from './widgets/striped-progress-bar/striped-progress-bar';

@Component({
  selector: 'app-progress',
  imports: [
    InitialProgressBar,
    StripedProgressBar,
    AnimatedProgressBar,
    MultipleBar,
    NumberStepProgress,
    CustomProgressBar,
    SmallProgressBar,
    LargeProgressBar,
    CustomSizeProgressBar,
    StepProgressBar,
  ],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {}
