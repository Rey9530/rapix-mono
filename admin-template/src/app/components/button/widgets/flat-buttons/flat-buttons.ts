import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { flatButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-flat-buttons',
  imports: [Card, LowerCasePipe],
  templateUrl: './flat-buttons.html',
  styleUrl: './flat-buttons.scss',
})
export class FlatButtons {
  public flatButton = flatButton;
}
