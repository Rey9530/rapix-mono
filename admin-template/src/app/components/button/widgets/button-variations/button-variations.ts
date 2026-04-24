import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../shared/components/ui/card/card';
import {
  horizontalVariationCheckbox,
  verticalVariationColor,
  verticalVariationRadio,
} from '../../../../shared/data/buttons';

@Component({
  selector: 'app-button-variations',
  imports: [Card, LowerCasePipe],
  templateUrl: './button-variations.html',
  styleUrl: './button-variations.scss',
})
export class ButtonVariations {
  public verticalVariationColor = verticalVariationColor;
  public verticalVariationRadio = verticalVariationRadio;
  public horizontalVariationCheckbox = horizontalVariationCheckbox;

  public open: boolean = false;
  public open2: boolean = false;
  public open3: boolean = false;
  public open4: boolean = false;
  public open5: boolean = false;

  openMenu() {
    this.open = !this.open;
  }
  openMenu2() {
    this.open2 = !this.open2;
  }
  openMenu3() {
    this.open3 = !this.open3;
  }
  openMenu4() {
    this.open4 = !this.open4;
  }
  openMenu5() {
    this.open5 = !this.open5;
  }
}
