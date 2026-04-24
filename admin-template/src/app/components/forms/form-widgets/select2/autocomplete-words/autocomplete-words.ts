import { Component } from '@angular/core';

import { Select2Module } from 'ng-select2-component';

import { Card } from '../../../../../shared/components/ui/card/card';
import { languageSearch } from '../../../../../shared/data/form-widgets';

@Component({
  selector: 'app-autocomplete-words',
  imports: [Select2Module, Card],
  templateUrl: './autocomplete-words.html',
  styleUrl: './autocomplete-words.scss',
})
export class AutocompleteWords {
  public languageSearch = languageSearch;
}
