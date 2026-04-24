import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { stepProgressBar } from '../../../../../shared/data/ui-kits/progress-bar';

@Component({
  selector: 'app-step-progress-bar',
  imports: [NgbProgressbarModule, Card, FeatherIcon, NgClass],
  templateUrl: './step-progress-bar.html',
  styleUrl: './step-progress-bar.scss',
})
export class StepProgressBar {
  public stepProgressBar = stepProgressBar;
  public activeStep = 3;

  handleStep(value: number) {
    this.activeStep = value;
  }
}
