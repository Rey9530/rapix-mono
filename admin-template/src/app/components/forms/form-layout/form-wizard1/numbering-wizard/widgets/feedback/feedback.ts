import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { selectState } from '../../../../../../../shared/data/form-layout';

@Component({
  selector: 'app-feedback',
  imports: [Select2Module],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  public selectState = selectState;
}
