import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { colorsTwo } from '../../../../../shared/data/ui-kits/helper-classes';

@Component({
  selector: 'app-link-underlines',
  imports: [TitleCasePipe, Card],
  templateUrl: './link-underlines.html',
  styleUrl: './link-underlines.scss',
})
export class LinkUnderlines {
  public colors = colorsTwo;
}
