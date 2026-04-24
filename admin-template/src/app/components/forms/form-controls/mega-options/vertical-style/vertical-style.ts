import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { verticalStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-vertical-style',
  imports: [NgbRatingModule, Card, NgClass],
  templateUrl: './vertical-style.html',
  styleUrl: './vertical-style.scss',
})
export class VerticalStyle {
  private config = inject(NgbRatingConfig);

  public verticalStyle = verticalStyle;

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
