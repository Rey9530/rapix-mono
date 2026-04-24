import { Component } from '@angular/core';

import { Select2Data, Select2Module } from 'ng-select2-component';

import { degree } from '../../../../../../shared/data/jobs/apply-form';

@Component({
  selector: 'app-your-education',
  imports: [Select2Module],
  templateUrl: './your-education.html',
  styleUrl: './your-education.scss',
})
export class YourEducation {
  public degree: Select2Data = degree;
}
