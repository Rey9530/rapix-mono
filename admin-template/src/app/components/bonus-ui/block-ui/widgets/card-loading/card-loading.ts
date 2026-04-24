import { Component, inject } from '@angular/core';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-card-loading',
  imports: [NgxSpinnerModule, Card],
  templateUrl: './card-loading.html',
  styleUrl: './card-loading.scss',
})
export class CardLoading {
  private spinner = inject(NgxSpinnerService);

  public type: string;
  public loadingShow: boolean = false;

  loading(type: string) {
    this.loadingShow = true;
    this.type = type;
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      this.loadingShow = false;
    }, 3000);
  }
}
