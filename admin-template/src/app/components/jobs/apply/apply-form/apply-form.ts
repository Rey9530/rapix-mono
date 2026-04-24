import { Component, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { PersonalDetails } from './widgets/personal-details/personal-details';
import { UploadFiles } from './widgets/upload-files/upload-files';
import { YourEducation } from './widgets/your-education/your-education';
import { YourExperience } from './widgets/your-experience/your-experience';

@Component({
  selector: 'app-apply-form',
  imports: [
    NgbRatingModule,
    PersonalDetails,
    YourEducation,
    YourExperience,
    UploadFiles,
  ],
  templateUrl: './apply-form.html',
  styleUrl: './apply-form.scss',
})
export class ApplyForm {
  config = inject(NgbRatingConfig);

  constructor() {
    const config = this.config;

    config.max = 5;
    config.readonly = true;
  }
}
