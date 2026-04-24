import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-error-403',
  imports: [SvgIcon],
  templateUrl: './error-403.html',
  styleUrl: './error-403.scss',
})
export class Error403 {
  private location = inject(Location);

  navigate() {
    this.location.back();
  }
}
