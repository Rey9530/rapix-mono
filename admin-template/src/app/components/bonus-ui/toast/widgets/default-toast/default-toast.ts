import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-default-toast',
  imports: [Card, NgClass],
  templateUrl: './default-toast.html',
  styleUrl: './default-toast.scss',
})
export class DefaultToast {
  public showToast: boolean = true;

  closeToast() {
    this.showToast = false;
  }
}
