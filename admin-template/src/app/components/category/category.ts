import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CategoryFilter } from './widgets/category-filter/category-filter';
import { CreateCategoryModal } from '../../shared/components/ui/modal/create-category-modal/create-category-modal';
import { Table } from '../../shared/components/ui/table/table';
import { category } from '../../shared/data/category';
import { ICategory } from '../../shared/interface/category';
import {
  ITableClickedAction,
  ITableConfigs,
} from '../../shared/interface/common';

@Component({
  selector: 'app-category',
  imports: [CategoryFilter, Table],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category {
  private modal = inject(NgbModal);

  public categories: ICategory[];
  public tableConfig: ITableConfigs<ICategory> = {
    columns: [
      { title: 'Category', field_value: 'category_name', sort: true },
      { title: 'Description', field_value: 'description', sort: true },
      { title: 'Category Type', field_value: 'category_type', sort: true },
    ],
    row_action: [
      { label: 'Edit', action_to_perform: 'edit', icon: 'edit-content' },
      {
        label: 'Delete',
        action_to_perform: 'delete',
        icon: 'trash1',
        modal: true,
        model_text: 'Do you really want to delete the category?',
      },
    ],
    data: [] as ICategory[],
  };

  constructor() {
    this.tableConfig.data = this.category(category);
    this.categories = category;
  }

  handleAction(value: ITableClickedAction<ICategory>) {
    if (value.action_to_perform === 'delete' && value.data) {
      this.categories = this.categories.filter(
        (category: ICategory) => category.id !== value.data!.id,
      );
      this.tableConfig = {
        ...this.tableConfig,
        data: this.category(this.categories),
      };
    }
  }

  private category(categories: ICategory[]) {
    return categories.map((category: ICategory) => {
      const formattedCategory = { ...category };
      formattedCategory.category_name = `<div class="product-names">
                                <div class="light-product-box">
                                  <img class="img-fluid" src="${category.image}" alt="t-shirt">
                                </div>
                                <p>${category.category_name}</p>
                              </div>`;

      formattedCategory.description = `<p class="f-light">${category.description}</p>`;
      formattedCategory.category_type = `<span class="badge badge-light-${category.color}">${category.category_type}</span>`;
      return formattedCategory;
    });
  }

  openCategoryModal() {
    this.modal.open(CreateCategoryModal, { size: 'lg', centered: true });
  }

  ngOnDestroy() {
    this.tableConfig.data = [];
  }
}
