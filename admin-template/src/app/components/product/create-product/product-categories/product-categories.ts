import { Component, output, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { TagInputModule } from 'ngx-chips';

import { CreateCategoryModal } from '../../../../shared/components/ui/modal/create-category-modal/create-category-modal';
import { SvgIcon } from '../../../../shared/components/ui/svg-icon/svg-icon';
import { productCategory } from '../../../../shared/data/product';

@Component({
  selector: 'app-product-categories',
  imports: [
    TagInputModule,
    FormsModule,
    AngularEditorModule,
    Select2Module,
    SvgIcon,
  ],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.scss',
})
export class ProductCategories {
  private modal = inject(NgbModal);
  readonly active = input<number>(0);
  readonly changeTab = output<number>();

  public productCategory = productCategory;
  public items = ['watches', 'sports', 'clothes', 'bottles'];

  createCategoryModal() {
    this.modal.open(CreateCategoryModal, { size: 'lg' });
  }

  next() {
    const nextTab = this.active() + 1;
    this.changeTab.emit(nextTab);
  }

  previous() {
    const prevTab = this.active() - 1;
    this.changeTab.emit(prevTab);
  }
}
