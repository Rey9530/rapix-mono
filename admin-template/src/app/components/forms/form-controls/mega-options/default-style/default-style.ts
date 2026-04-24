import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { defaultStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-default-style',
  imports: [Card],
  templateUrl: './default-style.html',
  styleUrl: './default-style.scss',
})
export class DefaultStyle {
  public defaultStyle = defaultStyle;
}
