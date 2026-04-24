import { Component, inject } from '@angular/core';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { Card } from '../../../../../shared/components/ui/card/card';

@Component({
  selector: 'app-form-loading',
  imports: [NgxSpinnerModule, Card],
  templateUrl: './form-loading.html',
  styleUrl: './form-loading.scss',
})
export class FormLoading {
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
