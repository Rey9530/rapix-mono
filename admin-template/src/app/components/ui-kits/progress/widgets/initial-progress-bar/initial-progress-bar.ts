import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-initial-progress-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './initial-progress-bar.html',
  styleUrl: './initial-progress-bar.scss',
})
export class InitialProgressBar {}
