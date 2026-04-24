import { NgClass } from '@angular/common';
import { Component, input, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { featuredTutorialDetails } from '../../../../shared/data/knowledge-base';

@Component({
  selector: 'app-common-featured-tutorials',
  imports: [NgbRatingModule, NgClass],
  templateUrl: './common-featured-tutorials.html',
  styleUrl: './common-featured-tutorials.scss',
})
export class CommonFeaturedTutorials {
  config = inject(NgbRatingConfig);

  readonly details = input(featuredTutorialDetails);
  readonly headerTitle = input<string>('');

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
