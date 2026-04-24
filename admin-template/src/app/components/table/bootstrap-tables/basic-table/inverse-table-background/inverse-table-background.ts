import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { inverseTableBackground } from '../../../../../shared/data/bootstrap-table';

@Component({
  selector: 'app-inverse-table-background',
  imports: [Card],
  templateUrl: './inverse-table-background.html',
  styleUrl: './inverse-table-background.scss',
})
export class InverseTableBackground {
  public inverseTableBackground = inverseTableBackground;
}
