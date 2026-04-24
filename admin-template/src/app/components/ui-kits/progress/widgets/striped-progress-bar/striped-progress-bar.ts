import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-striped-progress-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './striped-progress-bar.html',
  styleUrl: './striped-progress-bar.scss',
})
export class StripedProgressBar {}
