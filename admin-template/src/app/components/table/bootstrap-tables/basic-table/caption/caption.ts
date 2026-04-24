import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { caption } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-caption',
  imports: [Card],
  templateUrl: './caption.html',
  styleUrl: './caption.scss',
})
export class Caption {
  public caption = caption;
}
