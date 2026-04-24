import { Component, inject } from '@angular/core';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-block-loading',
  imports: [NgxSpinnerModule, Card],
  templateUrl: './block-loading.html',
  styleUrl: './block-loading.scss',
})
export class BlockLoading {
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
