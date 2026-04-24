import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import { selectInputSearch } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-select-input-using-search',
  imports: [Select2Module, Card],
  templateUrl: './select-input-using-search.html',
  styleUrl: './select-input-using-search.scss',
})
export class SelectInputUsingSearch {
  public selectInputSearch = selectInputSearch;
}
