import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-custom-progress-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './custom-progress-bar.html',
  styleUrl: './custom-progress-bar.scss',
})
export class CustomProgressBar {}
