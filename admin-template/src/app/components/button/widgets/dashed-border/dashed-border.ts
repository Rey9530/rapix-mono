import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { dashedBorder } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-dashed-border',
  imports: [Card, LowerCasePipe],
  templateUrl: './dashed-border.html',
  styleUrl: './dashed-border.scss',
})
export class DashedBorder {
  public dashedBorder = dashedBorder;
}
