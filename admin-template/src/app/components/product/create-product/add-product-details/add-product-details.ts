import { Component, input, output } from '@angular/core';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';

@Component({
  selector: 'app-add-product-details',
  imports: [AngularEditorModule, SvgIcon],
  templateUrl: './add-product-details.html',
  styleUrl: './add-product-details.scss',
})
export class AddProductDetails {
  readonly active = input<number>(0);

  readonly changeTab = output<number>();

  next() {
    const nextTab = this.active() + 1;
    this.changeTab.emit(nextTab);
  }
}
