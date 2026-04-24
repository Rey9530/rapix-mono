import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { solidBorderStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-solid-border-style',
  imports: [Card],
  templateUrl: './solid-border-style.html',
  styleUrl: './solid-border-style.scss',
})
export class SolidBorderStyle {
  public solidBorderStyle = solidBorderStyle;
}
