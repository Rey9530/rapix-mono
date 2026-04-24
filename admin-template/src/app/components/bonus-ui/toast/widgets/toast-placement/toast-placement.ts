import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Select2Module, Select2UpdateEvent } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import { toastPosition } from '../../../../../shared/data/bonus-ui/toast';

@Component({
  selector: 'app-toast-placement',
  imports: [Select2Module, Card, NgClass],
  templateUrl: './toast-placement.html',
  styleUrl: './toast-placement.scss',
})
export class ToastPlacement {
  public showToast: boolean = true;
  public toastPosition = toastPosition;
  public positionClass: string = '';

  handlePosition(event: Select2UpdateEvent) {
    if (event && event.value) {
      this.positionClass = String(event.value);
    }
  }

  closeToast() {
    this.showToast = false;
  }
}
