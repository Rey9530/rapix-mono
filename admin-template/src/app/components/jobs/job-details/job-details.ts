import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { JobFilter } from '../job-filter/job-filter';
import { SimilarJobs } from './similar-jobs/similar-jobs';
import { jobDetail } from '../../../shared/data/jobs/jobs-search';

@Component({
  selector: 'app-job-details',
  imports: [RouterModule, NgbRatingModule, JobFilter, SimilarJobs],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails {
  config = inject(NgbRatingConfig);

  public jobDetail = jobDetail;

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
