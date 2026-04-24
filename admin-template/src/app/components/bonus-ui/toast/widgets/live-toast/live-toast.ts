import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-live-toast',
  imports: [Card],
  templateUrl: './live-toast.html',
  styleUrl: './live-toast.scss',
})
export class LiveToast {
  public toast = {
    topRight: false,
    bottomRight: false,
    topLeft: false,
    bottomLeft: false,
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
