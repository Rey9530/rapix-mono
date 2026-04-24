import { Component, inject, input } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { IJobCard } from '../../../shared/interface/jobs';

@Component({
  selector: 'app-common-card',
  imports: [NgbRatingModule],
  templateUrl: './common-card.html',
  styleUrl: './common-card.scss',
})
export class CommonCard {
  config = inject(NgbRatingConfig);
  readonly jobCard = input<IJobCard>();

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
