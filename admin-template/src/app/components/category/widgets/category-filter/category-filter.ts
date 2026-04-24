import { Component } from '@angular/core';

import { Select2Data, Select2Module } from 'ng-select2-component';

import { Card } from '../../../../shared/components/ui/card/card';
import { category, categoryStatus } from '../../../../shared/data/category';
import { ICategory } from '../../../../shared/interface/category';

@Component({
  selector: 'app-category-filter',
  imports: [Select2Module, Card],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilter {
  public category: ICategory[] = category;
  public categoryStatus = categoryStatus;
  public parentCategory: Select2Data = [];
  public categoryType: Select2Data = [];

  constructor() {
    this.category.filter((category) => {
      this.parentCategory.push({
        value: category.category_name,
        label: category.category_name,
      });
      this.categoryType.push({
        value: category.category_type,
        label: category.category_type,
      });
    });
  }
}
