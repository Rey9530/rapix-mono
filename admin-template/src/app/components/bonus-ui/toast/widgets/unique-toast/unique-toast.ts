import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-unique-toast',
  imports: [Card, NgClass],
  templateUrl: './unique-toast.html',
  styleUrl: './unique-toast.scss',
})
export class UniqueToast {
  public showToast: boolean = true;

  closeToast() {
    this.showToast = false;
  }
}
