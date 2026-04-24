import { Component } from '@angular/core';

import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { sidebars } from '../../../shared/data/jobs/jobs-search';
import { IJobFilter } from '../../../shared/interface/jobs';

@Component({
  selector: 'app-job-filter',
  imports: [NgbModule, NgbAccordionModule, FeatherIcon],
  templateUrl: './job-filter.html',
  styleUrl: './job-filter.scss',
})
export class JobFilter {
  public sidebars: IJobFilter[] = sidebars;
  public isOpen: boolean = false;

  openSidebar() {
    this.isOpen = !this.isOpen;
  }
}
