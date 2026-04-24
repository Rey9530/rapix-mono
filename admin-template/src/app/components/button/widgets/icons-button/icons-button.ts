import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../shared/components/ui/feather-icon/feather-icon';
import { iconsButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-icons-button',
  imports: [Card, FeatherIcon],
  templateUrl: './icons-button.html',
  styleUrl: './icons-button.scss',
})
export class IconsButton {
  public iconsButton = iconsButton;
}
