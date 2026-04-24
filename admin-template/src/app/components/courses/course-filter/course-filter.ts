import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  NgbAccordionModule,
  NgbRatingConfig,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcon } from '../../../shared/components/ui/feather-icon/feather-icon';
import { courseSidebar } from '../../../shared/data/courses';

@Component({
  selector: 'app-course-filter',
  imports: [NgbAccordionModule, FeatherIcon, NgbRatingModule, NgClass],
  templateUrl: './course-filter.html',
  styleUrl: './course-filter.scss',
})
export class CourseFilter {
  config = inject(NgbRatingConfig);

  public courseSidebar = courseSidebar;
  public isOpen: boolean = false;

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }

  openFilter() {
    this.isOpen = !this.isOpen;
  }
}
