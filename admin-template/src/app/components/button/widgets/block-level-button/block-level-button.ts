import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { blockButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-block-level-button',
  imports: [Card],
  templateUrl: './block-level-button.html',
  styleUrl: './block-level-button.scss',
})
export class BlockLevelButton {
  public blockButton = blockButton;
}
