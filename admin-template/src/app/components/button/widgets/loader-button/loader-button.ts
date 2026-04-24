import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import { loaderButton } from '../../../../shared/data/buttons';

@Component({
  selector: 'app-loader-button',
  imports: [Card],
  templateUrl: './loader-button.html',
  styleUrl: './loader-button.scss',
})
export class LoaderButton {
  public loaderButton = loaderButton;
}
