import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import {
  commonOpacity,
  defaultLink,
  underlineOpacity,
} from '../../../../../shared/data/ui-kits/navigate-links';

@Component({
  selector: 'app-common-links',
  imports: [Card],
  templateUrl: './common-links.html',
  styleUrl: './common-links.scss',
})
export class CommonLinks {
  public commonOpacity = commonOpacity;
  public underlineOpacity = underlineOpacity;
  public defaultLink = defaultLink;
}
