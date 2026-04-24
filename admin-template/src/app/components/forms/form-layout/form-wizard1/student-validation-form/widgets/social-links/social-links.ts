import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { selectPosition } from '../../../../../../../shared/data/form-layout';

@Component({
  selector: 'app-social-links',
  imports: [Select2Module],
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  public selectPosition = selectPosition;
}
