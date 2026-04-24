import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Select2Module } from 'ng-select2-component';
import { TagInputModule } from 'ngx-chips';

import { SvgIcon } from '../../../../../shared/components/ui/svg-icon/svg-icon';
import {
  colorOptionName,
  colorOptionValue,
} from '../../../../../shared/data/product';

@Component({
  selector: 'app-variations',
  imports: [TagInputModule, FormsModule, Select2Module, SvgIcon],
  templateUrl: './variations.html',
  styleUrl: './variations.scss',
})
export class Variations {
  readonly additionalActiveId = input<number>(0);
  readonly changeTabDetails = output<number>();

  public colors = ['Green', 'Purple', 'Yellow', 'Blue'];
  public colorOptionName = colorOptionName;
  public colorOptionValue = colorOptionValue;

  next() {
    const nextId = this.additionalActiveId() + 1;
    this.changeTabDetails.emit(nextId);
  }

  previous() {
    const prevId = this.additionalActiveId() - 1;
    this.changeTabDetails.emit(prevId);
  }
}
