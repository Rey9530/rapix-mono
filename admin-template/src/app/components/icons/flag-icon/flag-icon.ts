import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { Card } from '../../../shared/components/ui/card/card';
import { flagIcon } from '../../../shared/data/icons/flag-icon';

@Component({
  selector: 'app-flag-icon',
  imports: [Card, UpperCasePipe],
  templateUrl: './flag-icon.html',
  styleUrl: './flag-icon.scss',
})
export class FlagIcon {
  private toast = inject(ToastrService);

  public flagIcon = flagIcon;
  public details: boolean = false;
  public flag: string;
  public val: string;

  getDetails(value: string) {
    this.details = true;
    this.flag = value;
    this.val = '<i class="flag-icon flag-icon-' + value + '"></i>';
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toast.show('Code Copied to clipboard!', '', {
      positionClass: 'toast-bottom-right',
      closeButton: true,
      toastClass: 'alert alert-copy notify-alert',
      timeOut: 1000,
    });
  }
}
