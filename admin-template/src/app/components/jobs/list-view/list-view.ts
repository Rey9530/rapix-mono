import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { jobCards } from '../../../shared/data/jobs/jobs-search';
import { CommonCard } from '../common-card/common-card';
import { JobFilter } from '../job-filter/job-filter';

@Component({
  selector: 'app-list-view',
  imports: [NgbRatingModule, JobFilter, CommonCard, SlicePipe],
  templateUrl: './list-view.html',
  styleUrl: './list-view.scss',
})
export class ListView {
  config = inject(NgbRatingConfig);

  public jobCards = jobCards;

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
