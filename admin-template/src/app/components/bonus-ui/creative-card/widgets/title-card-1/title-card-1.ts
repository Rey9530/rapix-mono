import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-title-card-1',
  imports: [Card, FeatherIcon],
  templateUrl: './title-card-1.html',
  styleUrl: './title-card-1.scss',
})
export class TitleCard1 {}
