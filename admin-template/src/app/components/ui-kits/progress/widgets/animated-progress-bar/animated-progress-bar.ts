import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-animated-progress-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './animated-progress-bar.html',
  styleUrl: './animated-progress-bar.scss',
})
export class AnimatedProgressBar {}
