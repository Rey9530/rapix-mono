import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-color-scheme-toast',
  imports: [Card, NgClass],
  templateUrl: './color-scheme-toast.html',
  styleUrl: './color-scheme-toast.scss',
})
export class ColorSchemeToast {
  public showToast: boolean = true;

  closeToast() {
    this.showToast = false;
  }
}
