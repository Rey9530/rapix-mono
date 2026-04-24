import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { inlineStyle } from '../../../../../shared/data/form-control';

@Component({
  selector: 'app-inline-style',
  imports: [Card],
  templateUrl: './inline-style.html',
  styleUrl: './inline-style.scss',
})
export class InlineStyle {
  public inlineStyle = inlineStyle;
}
