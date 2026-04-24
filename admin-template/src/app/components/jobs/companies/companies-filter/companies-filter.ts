import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  NgbAccordionModule,
  NgbModule,
  NgbRatingConfig,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { companiesSidebar } from '../../../../shared/data/jobs/companies';

@Component({
  selector: 'app-companies-filter',
  imports: [
    NgbAccordionModule,
    NgbModule,
    NgbRatingModule,
    Card,
    FeatherIcon,
    NgClass,
  ],
  templateUrl: './companies-filter.html',
  styleUrl: './companies-filter.scss',
})
export class CompaniesFilter {
  config = inject(NgbRatingConfig);

  public sidebar = companiesSidebar;
  public isOpen: boolean = false;

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }

  openSidebar() {
    this.isOpen = !this.isOpen;
  }
}
