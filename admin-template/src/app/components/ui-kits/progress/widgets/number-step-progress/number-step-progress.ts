import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-number-step-progress',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './number-step-progress.html',
  styleUrl: './number-step-progress.scss',
})
export class NumberStepProgress {}
