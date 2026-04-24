import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { withoutBorderStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-without-border-style',
  imports: [Card],
  templateUrl: './without-border-style.html',
  styleUrl: './without-border-style.scss',
})
export class WithoutBorderStyle {
  public withoutBorderStyle = withoutBorderStyle;
}
