import { Component } from '@angular/core';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-custom-size-progress-bar',
  imports: [NgbProgressbarModule, Card],
  templateUrl: './custom-size-progress-bar.html',
  styleUrl: './custom-size-progress-bar.scss',
})
export class CustomSizeProgressBar {}
