import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { filterCandidate } from '../../../../shared/data/jobs/candidates';

@Component({
  selector: 'app-candidate-filter',
  imports: [Select2Module],
  templateUrl: './candidate-filter.html',
  styleUrl: './candidate-filter.scss',
})
export class CandidateFilter {
  public filterCandidate = filterCandidate;
}
