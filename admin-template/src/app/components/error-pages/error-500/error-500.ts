import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-error-500',
  imports: [SvgIcon],
  templateUrl: './error-500.html',
  styleUrl: './error-500.scss',
})
export class Error500 {
  private location = inject(Location);

  navigate() {
    this.location.back();
  }
}
