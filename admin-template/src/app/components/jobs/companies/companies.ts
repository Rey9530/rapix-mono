import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { CompaniesFilter } from './companies-filter/companies-filter';
import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';
import { companyDetails } from '../../../shared/data/jobs/companies';

@Component({
  selector: 'app-companies',
  imports: [RouterModule, NgbRatingModule, CompaniesFilter, SvgIcon, NgClass],
  templateUrl: './companies.html',
  styleUrl: './companies.scss',
})
export class Companies {
  config = inject(NgbRatingConfig);

  public companyDetails = companyDetails;

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
