import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-small-progress-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './small-progress-bar.html',
  styleUrl: './small-progress-bar.scss',
})
export class SmallProgressBar {}
