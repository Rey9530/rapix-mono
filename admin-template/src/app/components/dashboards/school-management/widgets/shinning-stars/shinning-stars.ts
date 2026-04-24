import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { cardToggleOptions3 } from '../../../../../shared/data/common';
import { shiningStar } from '../../../../../shared/data/dashboard/school-management';

@Component({
  selector: 'app-shinning-stars',
  imports: [Card, SlicePipe],
  templateUrl: './shinning-stars.html',
  styleUrl: './shinning-stars.scss',
})
export class ShinningStars {
  public shiningStar = shiningStar;
  public cardToggleOption = cardToggleOptions3;
}
