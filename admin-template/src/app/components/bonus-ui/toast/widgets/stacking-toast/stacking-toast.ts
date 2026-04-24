import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { stackingToast } from '../../../../../shared/data/bonus-ui/toast';

@Component({
  selector: 'app-stacking-toast',
  imports: [Card, FeatherIcon, NgClass],
  templateUrl: './stacking-toast.html',
  styleUrl: './stacking-toast.scss',
})
export class StackingToast {
  public stackingToast = stackingToast;

  constructor() {
    this.stackingToast.forEach((toast) => {
      if (toast) {
        setTimeout(() => {
          toast.show = false;
        }, toast.time_out);
      }
    });
  }

  closeToast(id: number) {
    this.stackingToast.filter((toast) => {
      if (toast.id == id) {
        toast.show = false;
      }
    });
  }
}
