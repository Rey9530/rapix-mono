import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { horizontalEditable } from '../../../../../shared/data/ui-kits/divider';

@Component({
  selector: 'app-horizontal-editable',
  imports: [Card],
  templateUrl: './horizontal-editable.html',
  styleUrl: './horizontal-editable.scss',
})
export class HorizontalEditable {
  public horizontalEditable = horizontalEditable;
}
