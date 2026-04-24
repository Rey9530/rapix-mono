import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-horizontal-style',
  imports: [NgbRatingModule, Card, NgClass],
  templateUrl: './horizontal-style.html',
  styleUrl: './horizontal-style.scss',
})
export class HorizontalStyle {
  private config = inject(NgbRatingConfig);

  public horizontalStyle = horizontalStyle;

  constructor() {
    this.config.max = 5;
    this.config.readonly = true;
  }
}
