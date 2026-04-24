import { Component } from '@angular/core';

import { AutocompleteWords } from './autocomplete-words/autocomplete-words';
import { DefaultSelect } from './default-select/default-select';
import { DisabledReadonly } from './disabled-readonly/disabled-readonly';
import { MovieSuggestion } from './movie-suggestion/movie-suggestion';
import { RandomSuggestion } from './random-suggestion/random-suggestion';
import { ReadWriteOptions } from './read-write-options/read-write-options';
import { RenderSuggestion } from './render-suggestion/render-suggestion';
import { SelectInputUsingSearch } from './select-input-using-search/select-input-using-search';
import { SingleValueSelect } from './single-value-select/single-value-select';

@Component({
  selector: 'app-select2',
  imports: [
    SingleValueSelect,
    DefaultSelect,
    RandomSuggestion,
    ReadWriteOptions,
    DisabledReadonly,
    MovieSuggestion,
    AutocompleteWords,
    SelectInputUsingSearch,
    RenderSuggestion,
  ],
  templateUrl: './select2.html',
  styleUrl: './select2.scss',
})
export class Select2 {}
