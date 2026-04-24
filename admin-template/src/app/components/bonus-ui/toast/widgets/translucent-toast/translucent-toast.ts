import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';
import { translucentToasts } from '../../../../../shared/data/bonus-ui/toast';

@Component({
  selector: 'app-translucent-toast',
  imports: [Card, FeatherIcon, NgClass],
  templateUrl: './translucent-toast.html',
  styleUrl: './translucent-toast.scss',
})
export class TranslucentToast {
  public translucentToasts = translucentToasts;

  constructor() {
    this.translucentToasts.forEach((toast) => {
      if (toast) {
        setTimeout(() => {
          toast.show = false;
        }, toast.time_out);
      }
    });
  }

  closeToast(id: number) {
    this.translucentToasts.filter((toast) => {
      if (toast.id == id) {
        toast.show = false;
      }
    });
  }
}
