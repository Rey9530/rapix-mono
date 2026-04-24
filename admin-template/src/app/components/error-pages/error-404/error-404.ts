import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

import { SvgIcon } from '../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-error-404',
  imports: [SvgIcon],
  templateUrl: './error-404.html',
  styleUrl: './error-404.scss',
})
export class Error404 {
  private location = inject(Location);

  navigate() {
    this.location.back();
  }
}
