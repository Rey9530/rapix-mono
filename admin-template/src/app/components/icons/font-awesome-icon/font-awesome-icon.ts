import { Component, inject } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { Card } from '../../../shared/components/ui/card/card';
import { fontAwesomeIcon } from '../../../shared/data/icons/font-awesome-icon';

@Component({
  selector: 'app-font-awesome-icon',
  imports: [Card],
  templateUrl: './font-awesome-icon.html',
  styleUrl: './font-awesome-icon.scss',
})
export class FontAwesomeIcon {
  private toast = inject(ToastrService);

  public fontAwesomeIcon = fontAwesomeIcon;
  public details: boolean = false;
  public icon: string;
  public val: string;

  getDetails(value: string) {
    this.details = true;
    this.icon = value;
    this.val = '<i class="' + value + '"></i>';
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
