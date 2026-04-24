import { Component, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FeatherIcon } from '../../../../../../../shared/components/ui/feather-icon/feather-icon';
import { netBanking } from '../../../../../../../shared/data/form-layout';

@Component({
  selector: 'app-net-banking',
  imports: [FormsModule, ReactiveFormsModule, FeatherIcon],
  templateUrl: './net-banking.html',
  styleUrl: './net-banking.scss',
})
export class NetBanking {
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public netBanking = netBanking;
  public validate = false;
  public openMenu = false;

  public formValidation = new FormGroup({
    feedback: new FormControl('', Validators.required),
    agree: new FormControl('', Validators.required),
  });

  open() {
    this.openMenu = !this.openMenu;
  }

  next() {
    this.validate = true;
    this.formValidation.markAllAsTouched();

    if (this.formValidation.valid) {
      const nextTab = this.active();
      this.changeTab.emit(nextTab);
    }
  }

  previous() {
    const prevTab = this.active() - 1;
    this.changeTab.emit(prevTab);
  }
}
