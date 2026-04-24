import { Component, input, output, inject } from '@angular/core';

import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { Select2Module } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';

import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import { publishStatus } from '../../../../../shared/data/product';

@Component({
  selector: 'app-publish',
  imports: [OwlDateTimeModule, Select2Module, SvgIcon],
  templateUrl: './publish.html',
  styleUrl: './publish.scss',
})
export class Publish {
  private toast = inject(ToastrService);
  readonly additionalActiveId = input<number>(0);

  readonly changeTabDetails = output<number>();

  public publishStatus = publishStatus;

  next() {
    const nextId = this.additionalActiveId() + 1;
    this.changeTabDetails.emit(nextId);
  }

  previous() {
    const prevId = this.additionalActiveId() - 1;
    this.changeTabDetails.emit(prevId);
  }

  showSuccess() {
    this.toast.success('Submitted successfully');
  }
}
