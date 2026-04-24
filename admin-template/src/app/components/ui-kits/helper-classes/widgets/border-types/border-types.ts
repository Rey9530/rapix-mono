import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-border-types',
  imports: [TitleCasePipe, Card],
  templateUrl: './border-types.html',
  styleUrl: './border-types.scss',
})
export class BorderTypes {
  readonly borderType = input<string>();
}
