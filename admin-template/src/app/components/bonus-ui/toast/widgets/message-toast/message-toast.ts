import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';
import { FeatherIcon } from '../../../../../shared/components/ui/feather-icon/feather-icon';

@Component({
  selector: 'app-message-toast',
  imports: [Card, FeatherIcon],
  templateUrl: './message-toast.html',
  styleUrl: './message-toast.scss',
})
export class MessageToast {
  public toast = {
    success: false,
    warning: false,
    error: false,
  };

  showToast(value: keyof typeof this.toast) {
    this.toast[value] = true;

    setTimeout(() => {
      this.toast[value] = false;
    }, 5000);
  }

  closeToast(value: keyof typeof this.toast) {
    this.toast[value] = false;
  }
}
