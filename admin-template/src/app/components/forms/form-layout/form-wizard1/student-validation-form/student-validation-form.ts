import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddProfile } from './widgets/add-profile/add-profile';
import { SocialLinks } from './widgets/social-links/social-links';
import { StudentPersonalDetails } from './widgets/student-personal-details/student-personal-details';
import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-student-validation-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    StudentPersonalDetails,
    AddProfile,
    SocialLinks,
    Card,
  ],
  templateUrl: './student-validation-form.html',
  styleUrl: './student-validation-form.scss',
})
export class StudentValidationForm {
  public activeTab: number = 1;

  handleStep(value: number) {
    if (value == -1) {
      this.activeTab = this.activeTab - 1;
    } else if (value == 1 && this.activeTab < 3) {
      this.activeTab = this.activeTab + 1;
    }
  }
}
