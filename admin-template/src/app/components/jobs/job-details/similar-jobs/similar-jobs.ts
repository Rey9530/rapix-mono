import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { jobCards } from '../../../../shared/data/jobs/jobs-search';
import { CommonCard } from '../../common-card/common-card';

@Component({
  selector: 'app-similar-jobs',
  imports: [NgbRatingModule, CommonCard, SlicePipe],
  templateUrl: './similar-jobs.html',
  styleUrl: './similar-jobs.scss',
})
export class SimilarJobs {
  config = inject(NgbRatingConfig);

  public jobCardsDetails = jobCards;

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
